import express from "express";
import { getAmbulances, requestAmbulance, getUserRequests } from "../controllers/ambulanceController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAmbulances);
router.post("/request", authenticate, requestAmbulance);
router.get("/my-requests", authenticate, getUserRequests);

export default router;
