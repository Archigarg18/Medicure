import express from "express";
import { readData, writeData } from "../utils/fileHandler.js";

const router = express.Router();
const FILE_NAME = "appointments.json";

router.post("/", async (req, res) => {
  const { name, email, phone, department, doctor, date, time, notes } = req.body;

  if (!name || !email || !phone || !date || !time || !department) {
    return res.status(400).json({ success: false, message: "Missing required fields: name, email, phone, department, date, time are required" });
  }

  try {
    const appointments = await readData(FILE_NAME);
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
    await writeData(FILE_NAME, appointments);

    console.log("✓ New Appointment Booked:", newAppointment);
    res.status(201).json({ success: true, message: "Appointment booked successfully", appointment: newAppointment });
  } catch (error) {
    console.error("Error saving appointment:", error);
    res.status(500).json({ success: false, message: "Error saving appointment", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const appointments = await readData(FILE_NAME);

    // allow filtering by email query parameter so a user only sees their own appointments
    const { email } = req.query;
    if (email && typeof email === "string") {
      const filtered = appointments.filter((a) => a.email === email);
      return res.status(200).json({ success: true, data: filtered });
    }

    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ success: false, message: "Error fetching appointments", error: error.message });
  }
});

export default router;
