import { Router } from "express";
import { authorize } from "../middleware/authorize.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { createReview, getReviewsByUser } from "../controllers/reviews.controller.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { createReviewValidator, userReviewsValidator } from "../validators/review.validators.js";

const router = Router();

router.post(
  "/reviews",
  requireAuth,
  authorize("buyer"),
  createReviewValidator,
  validateRequest,
  createReview,
);
router.get("/reviews/:userId", userReviewsValidator, validateRequest, getReviewsByUser);

export default router;
