import express from "express";
import { createAppointment, getUserAppointments } from "../controllers/appointmentController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Protected routes
router.post("/", authenticate, createAppointment);
router.get("/", authenticate, getUserAppointments);

export default router;
