import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import userDetailRoutes from "./routes/userDetailsRoutes.js";
import severityRoutes from "./routes/severityRoutes.js";
import resolutionRoutes from "./routes/resolutionRoutes.js";
import classificationRoutes from "./routes/classificationRoutes.js";
import anomalyRoutes from "./routes/anomalyRoutes.js";
import civicIssueRoutes from "./routes/civicIssueRoute.js";  // Added Civic Issues API

dotenv.config();
const app = express();
const PORT = 5000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection failed:", error));

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:5173", methods: ["GET", "POST"], credentials: true }));
app.use("/uploads", express.static("uploads"));  // Serve uploaded files

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userDetailRoutes);
app.use("/api/severity", severityRoutes);
app.use("/api/resolution", resolutionRoutes);
app.use("/api/classification", classificationRoutes);
app.use("/api/anomaly", anomalyRoutes);
app.use("/api/issues", civicIssueRoutes);   // Added the Civic Issues route

app.get("/", (req, res) => res.send("API is running 🚀"));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
