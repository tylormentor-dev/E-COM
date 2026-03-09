import { Router } from "express";
import { authorize } from "../middleware/authorize.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  createBooking,
  getBuyerBookings,
  getMechanicBookings,
  updateBookingStatus,
} from "../controllers/bookings.controller.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import {
  createBookingValidator,
  updateBookingStatusValidator,
} from "../validators/booking.validators.js";

const router = Router();

router.post(
  "/bookings",
  requireAuth,
  authorize("buyer"),
  createBookingValidator,
  validateRequest,
  createBooking,
);
router.put(
  "/bookings/:id/status",
  requireAuth,
  authorize("mechanic"),
  updateBookingStatusValidator,
  validateRequest,
  updateBookingStatus,
);
router.get("/mechanic/bookings", requireAuth, authorize("mechanic"), getMechanicBookings);
router.get("/buyer/bookings", requireAuth, authorize("buyer"), getBuyerBookings);

export default router;
