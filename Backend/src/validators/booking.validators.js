import { body, param } from "express-validator";

export const createBookingValidator = [
  body("mechanic_id").isInt({ min: 1 }),
  body("service_category").trim().notEmpty().isLength({ max: 100 }),
  body("booking_date").isISO8601(),
  body("price_offer").isDecimal({ decimal_digits: "0,2" }),
];

export const updateBookingStatusValidator = [
  param("id").isInt({ min: 1 }),
  body("status").isIn([
    "pending",
    "approved",
    "denied",
    "renegotiating",
    "completed",
  ]),
];
