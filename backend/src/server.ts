import express, { Express, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import http from "http";
import fs from "fs";
import path from "path";
import { pathToFileURL, fileURLToPath } from "url";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "./middleware/auth.js";
import contactRoutes from "./routes/contactRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import ambulanceRoutes from "./routes/ambulanceRoutes.js";
import bloodRoutes from "./routes/bloodRoutes.js";
import medicineRoutes from "./routes/medicineRoutes.js";
import { setupSocketHandlers } from "./socket/handlers.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient({
  errorFormat: "pretty",
});

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 5002;

// ==================== VIEW ENGINE + COOKIES ====================

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(cookieParser());

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

// ==================== EJS ROUTES ====================

app.get("/auth/login", (req: Request, res: Response) => {
  res.render("login", { error: null });
});

app.post("/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).render("login", { error: "Email and password are required." });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).render("login", { error: "Invalid email or password." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).render("login", { error: "Invalid email or password." });
    }

    const token = generateToken(user.id, user.role);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.redirect("/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).render("login", { error: "Server error during login." });
  }
});

app.get("/auth/signup", (req: Request, res: Response) => {
  res.render("signup", { error: null });
});

app.post("/auth/signup", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).render("signup", { error: "Name, email, and password are required." });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).render("signup", { error: "Email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = generateToken(user.id, user.role);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.redirect("/dashboard");
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).render("signup", { error: "Server error during signup." });
  }
});

app.get("/dashboard", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.redirect("/auth/login");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key") as {
      userId: string;
      role: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { name: true, email: true, role: true },
    });

    if (!user) {
      return res.redirect("/auth/login");
    }

    return res.render("dashboard", { user });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.redirect("/auth/login");
  }
});

app.get("/auth/logout", (req: Request, res: Response) => {
  res.clearCookie("token");
  res.redirect("/auth/login");
});

// ==================== ROUTES ====================

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

app.use("/api/contact", contactRoutes);
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/ambulances", ambulanceRoutes);
app.use("/api/blood", bloodRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/appointments", appointmentRoutes);

// ==================== SSR & STATIC FILES ====================

const clientDistPath = path.resolve(__dirname, "../../dist");
const indexHtmlPath = path.join(clientDistPath, "index.html");
const ssrBundlePath = path.resolve(__dirname, "../../dist-ssr/entry-server.js");

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath, {
    extensions: ["js", "css", "map", "png", "svg", "ico", "json"],
  }));
}

// SSR Route - Render React app for any non-API route
// This should be AFTER all API routes
app.get("*", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Skip asset requests so static middleware can handle them
    if (req.path.includes(".")) {
      return next();
    }

    if (fs.existsSync(indexHtmlPath) && fs.existsSync(ssrBundlePath)) {
      const { renderPage } = await import(pathToFileURL(ssrBundlePath).href);
      const appMarkup = renderPage(req.originalUrl);
      const html = fs
        .readFileSync(indexHtmlPath, "utf-8")
        .replace('<div id="root"></div>', `<div id="root">${appMarkup}</div>`)
        .replace(
          "</body>",
          `<script>window.__INITIAL_STATE__ = ${JSON.stringify({})};</script></body>`
        );

      res.set("Content-Type", "text/html");
      return res.send(html);
    }

    if (fs.existsSync(indexHtmlPath)) {
      return res.sendFile(indexHtmlPath);
    }

    res.status(404).json({
      success: false,
      message:
        "Frontend build not found. Run the client build and restart the backend.",
    });
  } catch (error) {
    console.error("SSR Error:", error);
    next(error);
  }
});

// 404 - This will rarely be reached due to SSR wildcard above
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

    // Create HTTP server
    const httpServer = http.createServer(app);

    // Initialize Socket.io
    const io = new SocketIOServer(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
      transports: ["websocket", "polling"],
    });

    // Setup Socket.io handlers
    setupSocketHandlers(io);

    // Store io instance in app for access in routes if needed
    app.locals.io = io;

    httpServer.on("error", (error: any) => {
      if (error.code === "EADDRINUSE") {
        console.error(`✗ Port ${PORT} is already in use. Please stop the other process or set a different PORT in .env.`);
      } else {
        console.error("✗ HTTP server error:", error);
      }
      process.exit(1);
    });

    httpServer.listen(PORT, () => {
      console.log(`
========================================
 Heal Home Net Backend Running
 http://localhost:${PORT}
 WebSocket: ws://localhost:${PORT}
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