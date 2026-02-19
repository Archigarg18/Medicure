import express from "express";
import { readData, writeData } from "../utils/fileHandler.js";

const router = express.Router();
const FILE_NAME = "appointments.json";

router.post("/", async (req, res) => {
  const { name, email, phone, department, date, time, notes } = req.body;

  if (!name || !email || !phone || !date || !time) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const appointments = await readData(FILE_NAME);
    const newAppointment = {
      id: Date.now(),
      name,
      email,
      phone,
      department,
      date,
      time,
      notes,
      createdAt: new Date(),
    };

    appointments.push(newAppointment);
    await writeData(FILE_NAME, appointments);

    console.log("New Appointment Booked:", newAppointment);
    res.status(201).json({ message: "Appointment booked successfully", appointment: newAppointment });
  } catch (error) {
    res.status(500).json({ message: "Error saving appointment" });
  }
});

router.get("/", async (req, res) => {
  try {
    const appointments = await readData(FILE_NAME);
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments" });
  }
});

export default router;
