import { Router } from "express";
import { authorize } from "../middleware/authorize.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  getMechanic,
  listMechanics,
  subscribeMechanic,
  updateMechanicProfile,
} from "../controllers/mechanics.controller.js";

const router = Router();

router.get("/mechanics", listMechanics);
router.get("/mechanics/:id", getMechanic);
router.put(
  "/mechanics/profile",
  requireAuth,
  authorize("mechanic"),
  updateMechanicProfile,
);
router.post(
  "/mechanics/subscribe",
  requireAuth,
  authorize("mechanic"),
  subscribeMechanic,
);

export default router;
