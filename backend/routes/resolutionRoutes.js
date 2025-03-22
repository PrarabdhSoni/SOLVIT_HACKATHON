import express from "express";
import { predictResolutionTime } from "../controllers/resolutionController.js";

const router = express.Router();

router.post("/predict-resolution-time", predictResolutionTime);

export default router;
