import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
let PORT = process.env.PORT || 5000;
const DATA_DIR = path.join(__dirname, "data");

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Ensure data directory exists
await fs.mkdir(DATA_DIR, { recursive: true });

// Helper functions
const readData = async (filename) => {
  try {
    const data = await fs.readFile(path.join(DATA_DIR, filename), "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
};

const writeData = async (filename, data) => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  }
};

// ================== ROUTES ==================

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date(), uptime: process.uptime() });
});

// API Info
app.get("/api", (req, res) => {
  res.json({
    name: "Heal Home Net API",
    version: "1.0.0",
    description: "Hospital Management System Backend",
    endpoints: {
      health: "/health",
      api_info: "/api",
      docs: "/docs",
      contact: "POST /api/contact",
      appointments: "POST /api/appointments",
    },
  });
});

// API Docs
app.get("/docs", (req, res) => {
  res.json({
    message: "API Documentation",
    endpoints: {
      contact: "POST /api/contact",
      appointments: "POST /api/appointments",
    },
  });
});

// ============== CONTACT ENDPOINT ==============
app.post("/api/contact", async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Missing required fields: name, email, message" });
  }

  try {
    console.log("📨 Processing contact form:", { name, email });
    const messages = await readData("messages.json");
    const newMessage = {
      id: Date.now(),
      name,
      email,
      phone: phone || "",
      message,
      createdAt: new Date().toISOString(),
    };

    messages.push(newMessage);
    await writeData("messages.json", messages);

    console.log("✓ Contact message saved successfully");
    res.status(201).json({ success: true, message: "Message sent successfully", data: newMessage });
  } catch (error) {
    console.error("❌ Error saving contact:", error);
    res.status(500).json({ success: false, message: "Error saving message", error: error.message });
  }
});

// ============== APPOINTMENTS ENDPOINT ==============
app.post("/api/appointments", async (req, res) => {
  const { name, email, phone, department, doctor, date, time, notes } = req.body;

  if (!name || !email || !phone || !department || !date || !time) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: name, email, phone, department, date, time",
    });
  }

  try {
    console.log("📅 Processing appointment:", { name, department, doctor, date, time });
    const appointments = await readData("appointments.json");
    const newAppointment = {
      id: Date.now(),
      name,
      email,
      phone,
      department,
      doctor: doctor || "Not specified",
      date,
      time,
      notes: notes || "",
      createdAt: new Date().toISOString(),
    };

    appointments.push(newAppointment);
    await writeData("appointments.json", appointments);

    console.log("✓ Appointment saved successfully");
    res.status(201).json({ success: true, message: "Appointment booked successfully", data: newAppointment });
  } catch (error) {
    console.error("❌ Error saving appointment:", error);
    res.status(500).json({ success: false, message: "Error saving appointment", error: error.message });
  }
});

// Get all appointments
app.get("/api/appointments", async (req, res) => {
  try {
    const appointments = await readData("appointments.json");
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching appointments" });
  }
});

// Get all messages
app.get("/api/contact", async (req, res) => {
  try {
    const messages = await readData("messages.json");
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching messages" });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.path} not found` });
});

// Start server with retry logic
const startServer = async (attemptPort) => {
  try {
    const server = app.listen(attemptPort, () => {
      console.log(`
╔═══════════════════════════════════════╗
║   🏥 Heal Home Net Backend Server     ║
║   Version: 1.0.0                      ║
║   Server: http://localhost:${attemptPort}      ║
║   Status: Running ✓                   ║
╚═══════════════════════════════════════╝
      `);
      console.log("✓ Contact API:      POST http://localhost:" + attemptPort + "/api/contact");
      console.log("✓ Appointments API: POST http://localhost:" + attemptPort + "/api/appointments");
      console.log("✓ Health Check:     GET http://localhost:" + attemptPort + "/health");
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.warn(`⚠️  Port ${attemptPort} is in use, trying ${attemptPort + 1}...`);
        startServer(attemptPort + 1);
      } else {
        console.error("❌ Server error:", err);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer(PORT);
