import { body, param } from "express-validator";

export const createVehicleValidator = [
  body("make").trim().notEmpty().isLength({ max: 80 }),
  body("model").trim().notEmpty().isLength({ max: 80 }),
  body("year").isInt({ min: 1950, max: 2100 }),
  body("price").isDecimal({ decimal_digits: "0,2" }),
  body("mileage").isInt({ min: 0 }),
  body("description").optional().trim(),
];

export const updateVehicleValidator = [
  param("id").isInt({ min: 1 }),
  body("make").optional().trim().notEmpty(),
  body("model").optional().trim().notEmpty(),
  body("year").optional().isInt({ min: 1950, max: 2100 }),
  body("price").optional().isDecimal({ decimal_digits: "0,2" }),
  body("mileage").optional().isInt({ min: 0 }),
  body("description").optional().trim(),
  body("status").optional().isIn(["available", "sold"]),
];
