import { body } from "express-validator";

export const registerValidator = [
  body("name").trim().notEmpty().isLength({ min: 2, max: 120 }),
  body("email").trim().isEmail().normalizeEmail(),
  body("password").isLength({ min: 8, max: 72 }),
  body("role").isIn(["admin", "mechanic", "dealer", "buyer"]),
  body("phone").optional().trim().isLength({ max: 30 }),
  body("city").optional().trim().isLength({ max: 100 }),
];

export const loginValidator = [
  body("email").trim().isEmail().normalizeEmail(),
  body("password").isLength({ min: 8, max: 72 }),
];
