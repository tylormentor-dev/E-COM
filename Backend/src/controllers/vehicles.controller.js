import { query } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { getPagination } from "../utils/pagination.js";

async function getDealerIdByUserId(userId) {
  const [rows] = await query("SELECT id FROM dealers WHERE user_id = ?", [userId]);
  return rows[0]?.id;
}

export const createVehicle = asyncHandler(async (req, res) => {
  const dealerId = await getDealerIdByUserId(req.user.id);
  if (!dealerId) throw new ApiError(403, "Dealer profile missing");

  const [dealerRows] = await query("SELECT verified FROM dealers WHERE id = ?", [
    dealerId,
  ]);
  if (!dealerRows[0].verified) {
    throw new ApiError(403, "Dealer must be admin-verified before posting");
  }

  const { make, model, year, price, mileage, description } = req.body;
  const [result] = await query(
    `
    INSERT INTO vehicles (dealer_id, make, model, year, price, mileage, description, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'available')
    `,
    [dealerId, make, model, year, price, mileage, description || null],
  );

  return res.status(201).json({ id: result.insertId });
});

export const listVehicles = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const [rows] = await query(
    `
    SELECT v.*, d.dealership_name, u.city
    FROM vehicles v
    JOIN dealers d ON d.id = v.dealer_id
    JOIN users u ON u.id = d.user_id
    ORDER BY v.created_at DESC
    LIMIT ? OFFSET ?
    `,
    [limit, offset],
  );
  return res.json({ page, limit, data: rows });
});

export const updateVehicle = asyncHandler(async (req, res) => {
  const vehicleId = Number(req.params.id);
  const dealerId = await getDealerIdByUserId(req.user.id);
  if (!dealerId) throw new ApiError(403, "Dealer profile missing");

  const [owned] = await query(
    "SELECT id FROM vehicles WHERE id = ? AND dealer_id = ?",
    [vehicleId, dealerId],
  );
  if (!owned.length) throw new ApiError(404, "Vehicle not found");

  const { make, model, year, price, mileage, description, status } = req.body;
  await query(
    `
    UPDATE vehicles
    SET make = COALESCE(?, make),
        model = COALESCE(?, model),
        year = COALESCE(?, year),
        price = COALESCE(?, price),
        mileage = COALESCE(?, mileage),
        description = COALESCE(?, description),
        status = COALESCE(?, status)
    WHERE id = ?
    `,
    [
      make || null,
      model || null,
      year || null,
      price || null,
      mileage || null,
      description || null,
      status || null,
      vehicleId,
    ],
  );

  return res.json({ message: "Vehicle updated" });
});

export const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicleId = Number(req.params.id);
  const dealerId = await getDealerIdByUserId(req.user.id);
  if (!dealerId) throw new ApiError(403, "Dealer profile missing");

  const [result] = await query(
    "DELETE FROM vehicles WHERE id = ? AND dealer_id = ?",
    [vehicleId, dealerId],
  );
  if (!result.affectedRows) throw new ApiError(404, "Vehicle not found");
  return res.status(204).send();
});
