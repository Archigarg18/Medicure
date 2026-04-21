import express from "express";
import { getBloodStock, requestBlood, getUserBloodRequests } from "../controllers/bloodController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/stock", getBloodStock);
router.post("/request", authenticate, requestBlood);
router.get("/my-requests", authenticate, getUserBloodRequests);

export default router;
