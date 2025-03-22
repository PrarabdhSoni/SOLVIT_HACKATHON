import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:5173", methods: ["GET", "POST"], credentials: true }));

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("API is running 🚀"));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
