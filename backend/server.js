import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import appointmentRoutes from "./routes/appointments.js";
import contactRoutes from "./routes/contact.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// API Routes
app.use("/api/appointments", appointmentRoutes);
app.use("/api/contact", contactRoutes);

// Serve static backend files
app.use("/static", express.static(path.join(__dirname, "public")));

// File stream handling
app.get("/api/logs", (req, res) => {
  const logPath = path.join(__dirname, "logs.txt");
  if (fs.existsSync(logPath)) {
    fs.createReadStream(logPath).pipe(res);
  } else {
    res.status(404).send("Logs not found");
  }
});

/* =========================
   SERVE FRONTEND (ONE PORT)
========================= */

app.use(express.static(path.join(__dirname, "../dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Error", error: err.message });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));