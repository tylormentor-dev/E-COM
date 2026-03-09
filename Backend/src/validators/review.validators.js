import { body, param } from "express-validator";

export const createReviewValidator = [
  body("target_user_id").isInt({ min: 1 }),
  body("rating").isInt({ min: 1, max: 5 }),
  body("comment").optional().trim().isLength({ max: 1000 }),
];

export const userReviewsValidator = [param("userId").isInt({ min: 1 })];
