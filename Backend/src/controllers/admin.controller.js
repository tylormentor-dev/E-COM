import { query } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

export const listUsers = asyncHandler(async (req, res) => {
  const [rows] = await query(
    "SELECT id, name, email, role, phone, city, created_at FROM users ORDER BY created_at DESC",
  );
  return res.json(rows);
});

export const listSubscriptions = asyncHandler(async (req, res) => {
  const [rows] = await query(
    `
    SELECT s.*, u.name, u.email, u.role
    FROM subscriptions s
    JOIN users u ON u.id = s.user_id
    ORDER BY s.renewal_date ASC
    `,
  );
  return res.json(rows);
});

export const verifyProfile = asyncHandler(async (req, res) => {
  const { role, userId } = req.params;
  const id = Number(userId);

  if (role !== "mechanic" && role !== "dealer") {
    throw new ApiError(400, "Role must be mechanic or dealer");
  }

  if (role === "mechanic") {
    const [result] = await query(
      "UPDATE mechanics SET verified = true WHERE user_id = ?",
      [id],
    );
    if (!result.affectedRows) throw new ApiError(404, "Mechanic not found");
  } else {
    const [result] = await query(
      "UPDATE dealers SET verified = true WHERE user_id = ?",
      [id],
    );
    if (!result.affectedRows) throw new ApiError(404, "Dealer not found");
  }

  return res.json({ message: `${role} verified` });
});
