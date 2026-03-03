import express from "express";
import {
  getDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctorController";
import { authenticate, authorize } from "../middleware/auth";
import {
  doctorValidation,
  validate,
} from "../middleware/validation";

const router = express.Router();

// Public routes
router.get("/", getDoctors);
router.get("/:id", getDoctor);

// Protected routes (admin only)
router.post(
  "/",
  authenticate,
  authorize("admin"),
  doctorValidation(),
  validate,
  createDoctor
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  doctorValidation(),
  validate,
  updateDoctor
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  deleteDoctor
);

export default router;
