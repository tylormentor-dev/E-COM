import { query } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { canBuyerReviewTarget } from "../services/reviewEligibility.service.js";

export const createReview = asyncHandler(async (req, res) => {
  const reviewerId = req.user.id;
  const { target_user_id, rating, comment } = req.body;

  if (req.user.role !== "buyer") {
    throw new ApiError(403, "Only buyers can create reviews");
  }

  const allowed = await canBuyerReviewTarget(reviewerId, target_user_id);
  if (!allowed) {
    throw new ApiError(
      403,
      "Buyer can only review users after completed transactions",
    );
  }

  const [result] = await query(
    `
    INSERT INTO reviews (reviewer_id, target_user_id, rating, comment)
    VALUES (?, ?, ?, ?)
    `,
    [reviewerId, target_user_id, rating, comment || null],
  );

  await query(
    `
    UPDATE mechanics m
    JOIN (
      SELECT target_user_id, AVG(rating) AS avg_rating
      FROM reviews
      WHERE target_user_id = ?
      GROUP BY target_user_id
    ) r ON r.target_user_id = m.user_id
    SET m.rating_avg = r.avg_rating
    `,
    [target_user_id],
  );

  return res.status(201).json({ id: result.insertId });
});

export const getReviewsByUser = asyncHandler(async (req, res) => {
  const userId = Number(req.params.userId);
  const [rows] = await query(
    `
    SELECT r.*, u.name AS reviewer_name
    FROM reviews r
    JOIN users u ON u.id = r.reviewer_id
    WHERE r.target_user_id = ?
    ORDER BY r.created_at DESC
    `,
    [userId],
  );
  return res.json(rows);
});
