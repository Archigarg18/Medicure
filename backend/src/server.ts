import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import contactRouter from "../routes/contact.js";
import appointmentsRouter from "../routes/appointments.js";
import userRoutes from "./routes/userRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import ambulanceRoutes from "./routes/ambulanceRoutes.js";
import bloodRoutes from "./routes/bloodRoutes.js";
import medicineRoutes from "./routes/medicineRoutes.js";

dotenv.config();

const prisma = new PrismaClient({
  errorFormat: "pretty",
});

const app: Express = express();
const PORT: number = 5002; // ✅ FIXED PORT

// ==================== MIDDLEWARE ====================

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(morgan("combined"));

// ==================== ROUTES ====================

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

app.use("/api/contact", contactRouter);
app.use("/api/appointments", appointmentsRouter);
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/ambulances", ambulanceRoutes);
app.use("/api/blood", bloodRoutes);
app.use("/api/medicines", medicineRoutes);

// 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.path} not found`,
  });
});

// Global error
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ==================== START SERVER ====================

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("✓ Database connected");

    app.listen(PORT, () => {
      console.log(`
========================================
 Heal Home Net Backend Running
 http://localhost:${PORT}
========================================
      `);
    });
  } catch (error) {
    console.error("✗ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export { app, prisma };