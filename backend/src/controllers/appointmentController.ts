import { Request, Response } from "express";
import { prisma } from "../server.js";

// Create a new appointment
export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { doctorId, date, time, notes } = req.body;
    
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    // Parse date and time into a single DateTime
    const appointmentDate = new Date(`${date}T${time}`);

    const appointment = await prisma.appointment.create({
      data: {
        userId: req.userId,
        doctorId,
        appointmentDate,
        notes,
        status: "pending",
      },
      include: {
        doctor: {
          include: {
            user: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: appointment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error booking appointment",
      error: error.message,
    });
  }
};

export const getUserAppointments = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const appointments = await prisma.appointment.findMany({
      where: { userId: req.userId },
      include: {
        doctor: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        appointmentDate: 'asc'
      }
    });

    const formatted = appointments.map(apt => ({
      id: apt.id,
      department: apt.doctor.specialty,
      doctor: apt.doctor.user.name,
      date: apt.appointmentDate.toISOString().split('T')[0],
      time: apt.appointmentDate.toTimeString().substring(0, 5),
      notes: apt.notes,
      status: apt.status
    }));

    res.json({
      success: true,
      data: formatted
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};
