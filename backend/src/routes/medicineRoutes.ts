import express from "express";
import { getMedicines, createPrescription, getUserPrescriptions } from "../controllers/medicineController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getMedicines);
router.post("/prescription", authenticate, createPrescription);
router.get("/my-prescriptions", authenticate, getUserPrescriptions);

export default router;
