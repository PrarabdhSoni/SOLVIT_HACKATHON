import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import severityRoutes from "./routes/severityRoutes.js";
import resolutionRoutes from "./routes/resolutionRoutes.js";
import classificationRoutes from "./routes/classificationRoutes.js";
import anomalyRoutes from "./routes/anomalyRoutes.js";

dotenv.config();
const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:5173", methods: ["GET", "POST"], credentials: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", severityRoutes);
app.use("/api", resolutionRoutes);
app.use("/api", classificationRoutes);
app.use("/api", anomalyRoutes);

app.get("/", (req, res) => res.send("API is running 🚀"));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
