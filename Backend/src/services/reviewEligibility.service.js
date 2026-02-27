import { query } from "../config/db.js";

export async function canBuyerReviewTarget(reviewerId, targetUserId) {
  const [bookingRows] = await query(
    `
    SELECT 1
    FROM bookings b
    JOIN mechanics m ON m.id = b.mechanic_id
    WHERE b.buyer_id = ? AND m.user_id = ? AND b.status = 'completed'
    LIMIT 1
    `,
    [reviewerId, targetUserId],
  );

  if (bookingRows.length > 0) return true;

  const [importRows] = await query(
    `
    SELECT 1
    FROM import_requests ir
    JOIN dealers d ON d.id = ir.dealer_id
    WHERE ir.buyer_id = ? AND d.user_id = ? AND ir.status = 'completed'
    LIMIT 1
    `,
    [reviewerId, targetUserId],
  );

  return importRows.length > 0;
}
