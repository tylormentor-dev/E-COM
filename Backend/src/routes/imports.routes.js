import { Router } from "express";
import { authorize } from "../middleware/authorize.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  createImportRequest,
  getAdminImports,
  updateImportStatus,
} from "../controllers/imports.controller.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import {
  createImportValidator,
  updateImportStatusValidator,
} from "../validators/import.validators.js";

const router = Router();

router.post(
  "/imports",
  requireAuth,
  authorize("buyer"),
  createImportValidator,
  validateRequest,
  createImportRequest,
);
router.get("/imports/admin", requireAuth, authorize("admin"), getAdminImports);
router.put(
  "/imports/:id/status",
  requireAuth,
  authorize("admin"),
  updateImportStatusValidator,
  validateRequest,
  updateImportStatus,
);

export default router;
