import express from "express";
import { readData, writeData } from "../utils/fileHandler.js";

const router = express.Router();
const FILE_NAME = "appointments.json";

/* ===========================
   CREATE APPOINTMENT
=========================== */
router.post("/", async (req, res) => {
  const { name, email, phone, department, doctor, date, time, notes } = req.body;

  if (!name || !email || !phone || !department || !date || !time) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
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

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error saving appointment",
      error: error.message,
    });
  }
});

/* ===========================
   GET APPOINTMENTS
   Supports filtering by email
   Example:
   /api/appointments?email=user@gmail.com
=========================== */
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    const appointments = await readData(FILE_NAME);

    // If email is provided, filter by that email
    if (email) {
      const filteredAppointments = appointments.filter(
        (appointment) => appointment.email === email
      );

      return res.status(200).json({
        success: true,
        data: filteredAppointments,
      });
    }

    // If no email provided, return all appointments
    return res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching appointments",
      error: error.message,
    });
  }
});

export default router;