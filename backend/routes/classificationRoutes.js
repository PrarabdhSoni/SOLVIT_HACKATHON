import express from "express";
import { classifyComplaint } from "../controllers/classificationController.js";

const router = express.Router();

router.post("/classify-complaint", classifyComplaint);

export default router;
