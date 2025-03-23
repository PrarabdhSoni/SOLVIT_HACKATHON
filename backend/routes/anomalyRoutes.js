import express from "express";
import { detectAnomaly } from "../controllers/anomalyController.js";

const router = express.Router();

router.post("/detect-anomaly", detectAnomaly);

export default router;
