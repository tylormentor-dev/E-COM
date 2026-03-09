import { Router } from "express";
import { authorize } from "../middleware/authorize.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  createVehicle,
  deleteVehicle,
  listVehicles,
  updateVehicle,
} from "../controllers/vehicles.controller.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import {
  createVehicleValidator,
  updateVehicleValidator,
} from "../validators/vehicle.validators.js";

const router = Router();

router.post(
  "/vehicles",
  requireAuth,
  authorize("dealer"),
  createVehicleValidator,
  validateRequest,
  createVehicle,
);
router.get("/vehicles", listVehicles);
router.put(
  "/vehicles/:id",
  requireAuth,
  authorize("dealer"),
  updateVehicleValidator,
  validateRequest,
  updateVehicle,
);
router.delete("/vehicles/:id", requireAuth, authorize("dealer"), deleteVehicle);

export default router;
