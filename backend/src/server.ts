import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Load environment variables
dotenv.config();

// Initialize Prisma Client
const prisma = new PrismaClient({
  errorFormat: "pretty",
});

// Create Express app
const app: Express = express();
let PORT: number = Number(process.env.PORT) || 5000;
let startAttempts = 0;
const MAX_PORT_ATTEMPTS = 10;

// ==================== MIDDLEWARE ====================

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// CORS middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Logging middleware
app.use(morgan("combined"));

// ==================== BASIC ROUTES ====================

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// API Info
app.get("/api", (req: Request, res: Response) => {
  res.json({
    name: "Heal Home Net API",
    version: "1.0.0",
    description: "Hospital Management System Backend",
    endpoints: {
      health: "/health",
      api_info: "/api",
      docs: "/docs",
    },
  });
});

// Placeholder route documentation
app.get("/docs", (req: Request, res: Response) => {
  res.json({
    message: "API Documentation",
    endpoints: {
      auth: "/api/auth",
      doctors: "/api/doctors",
      appointments: "/api/appointments",
      pharmacy: "/api/pharmacy",
      blood: "/api/blood",
      ambulance: "/api/ambulance",
      beds: "/api/beds",
      canteen: "/api/canteen",
      contact: "/api/contact",
    },
  });
});

// ==================== ERROR HANDLING MIDDLEWARE ====================

// 404 Not Found
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.path} not found`,
  });
});

// Global error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.ENV === "development" && { stack: err.stack }),
  });
});

// ==================== PRISMA & SERVER SETUP ====================

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
const startServer = async () => {
  try {
    // If DATABASE_URL is provided, test Prisma/MongoDB connection (MongoDB-compatible)
    if (process.env.DATABASE_URL) {
      try {
        await prisma.$runCommandRaw({ ping: 1 });
        console.log("✓ MongoDB connected successfully");
      } catch (dbErr) {
        console.warn("⚠️ Prisma/MongoDB ping failed:", dbErr);
        // continue starting server even if DB ping failed; controllers should handle DB errors
      }
    } else {
      console.warn("⚠️ DATABASE_URL not set; skipping DB connectivity check.");
    }

    // Start listening with error handling for EADDRINUSE
    const server = app.listen(PORT, () => {
      startAttempts = 0;
      console.log(`
╔════════════════════════════════════════╗
║   Heal Home Net Backend Server         ║
║   Version: 1.0.0                       ║
║   Environment: ${process.env.ENV || "development"}                ║
║   Server: http://localhost:${PORT}     ║
║   Status: Running ✓                    ║
╚════════════════════════════════════════╝
      `);
    });

    server.on("error", async (err: any) => {
      if (err && err.code === "EADDRINUSE") {
        console.warn(`Port ${PORT} is in use.`);
        if (startAttempts < MAX_PORT_ATTEMPTS) {
          startAttempts += 1;
          PORT += 1;
          console.log(`Trying to listen on port ${PORT} (attempt ${startAttempts}/${MAX_PORT_ATTEMPTS})`);
          setTimeout(() => startServer(), 300);
          return;
        }
        console.error("No available ports found after multiple attempts. Exiting.");
        await prisma.$disconnect();
        process.exit(1);
      }
      console.error("Server error:", err);
      await prisma.$disconnect();
      process.exit(1);
    });
  } catch (error) {
    console.error("✗ Failed to start server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();

export { app, prisma };
