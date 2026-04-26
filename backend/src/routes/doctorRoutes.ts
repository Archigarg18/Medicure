import express from "express";
import {
  getDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getMyAppointments,
  updateAvailableSlots
} from "../controllers/doctorController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import {
  doctorValidation,
  validate,
} from "../middleware/validation.js";

const router = express.Router();

// Public routes
router.get("/", getDoctors);
router.get("/:id", getDoctor);

// Protected routes (Doctor only)
router.get("/me/appointments", authenticate, authorize("doctor"), getMyAppointments);
router.put("/me/slots", authenticate, authorize("doctor"), updateAvailableSlots);

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
