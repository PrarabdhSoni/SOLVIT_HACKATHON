import express from "express";
import { predictSeverity } from "../controllers/severityController.js";

const router = express.Router();

router.post("/predict-severity", predictSeverity);

export default router;
