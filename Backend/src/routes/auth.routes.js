import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { loginValidator, registerValidator } from "../validators/auth.validators.js";
import { authRateLimiter } from "../middleware/rateLimiter.middleware.js";

const router = Router();

router.post("/register", authRateLimiter, registerValidator, validateRequest, register);
router.post("/login", authRateLimiter, loginValidator, validateRequest, login);

export default router;
