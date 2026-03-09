import { query } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

const COMMISSION_RATE = 0.15;

export const createImportRequest = asyncHandler(async (req, res) => {
  const buyerId = req.user.id;
  const { vehicle_details, estimated_price, dealer_id } = req.body;

  const commissionFee = Number(estimated_price) * COMMISSION_RATE;
  const [result] = await query(
    `
    INSERT INTO import_requests (buyer_id, dealer_id, vehicle_details, estimated_price, commission_fee, status)
    VALUES (?, ?, ?, ?, ?, 'pending')
    `,
    [buyerId, dealer_id || null, vehicle_details, estimated_price, commissionFee],
  );

  return res.status(201).json({
    id: result.insertId,
    commission_fee: Number(commissionFee.toFixed(2)),
  });
});

export const getAdminImports = asyncHandler(async (req, res) => {
  const [rows] = await query(
    `
    SELECT ir.*, b.name AS buyer_name, d.dealership_name
    FROM import_requests ir
    JOIN users b ON b.id = ir.buyer_id
    LEFT JOIN dealers d ON d.id = ir.dealer_id
    ORDER BY ir.created_at DESC
    `,
  );
  return res.json(rows);
});

export const updateImportStatus = asyncHandler(async (req, res) => {
  const importId = Number(req.params.id);
  const { status } = req.body;

  const [result] = await query(
    "UPDATE import_requests SET status = ? WHERE id = ?",
    [status, importId],
  );
  if (!result.affectedRows) throw new ApiError(404, "Import request not found");

  return res.json({ message: "Import request updated" });
});
