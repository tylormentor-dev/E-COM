import { body, param } from "express-validator";

export const createImportValidator = [
  body("vehicle_details").trim().notEmpty(),
  body("estimated_price").isDecimal({ decimal_digits: "0,2" }),
];

export const updateImportStatusValidator = [
  param("id").isInt({ min: 1 }),
  body("status").isIn(["pending", "processing", "completed"]),
];
