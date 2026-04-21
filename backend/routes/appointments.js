import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { name, email, phone, department, doctor, date, time, notes } = req.body;

  if (!name || !email || !phone || !date || !time || !department) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: name, email, phone, department, date, time are required",
    });
  }

  try {
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          password: "temporary_password",
          name,
          phone,
        },
      });
    }

    let doctorRecord = null;

    if (doctor) {
      doctorRecord = await prisma.doctor.findFirst({
        where: {
          user: {
            name: doctor,
          },
        },
      });
    }

    if (!doctorRecord) {
      let doctorUser = await prisma.user.findFirst({
        where: {
          name: doctor || "Not specified",
          role: "doctor",
        },
      });

      if (!doctorUser) {
        doctorUser = await prisma.user.create({
          data: {
            email: `${(doctor || "not-specified").toLowerCase().replace(/\s+/g, "-")}@medicure-doctor.local`,
            password: "temporary_password",
            name: doctor || "Not specified",
            role: "doctor",
          },
        });
      }

      doctorRecord = await prisma.doctor.create({
        data: {
          userId: doctorUser.id,
          specialty: department,
          experience: 0,
          consultationFee: 0,
          availableSlots: [],
        },
      });
    }

    const newAppointment = await prisma.appointment.create({
      data: {
        userId: user.id,
        doctorId: doctorRecord.id,
        appointmentDate: new Date(`${date}T${time}:00`),
        notes: notes || "",
        status: "pending",
      },
      include: {
        user: true,
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment: {
        id: newAppointment.id,
        name: newAppointment.user.name,
        email: newAppointment.user.email,
        phone: newAppointment.user.phone,
        department: newAppointment.doctor.specialty,
        doctor: newAppointment.doctor.user.name,
        date,
        time,
        notes: newAppointment.notes,
        createdAt: newAppointment.createdAt,
        status: newAppointment.status,
      },
    });
  } catch (error) {
    console.error("Error saving appointment:", error);
    res.status(500).json({
      success: false,
      message: "Error saving appointment",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const { email } = req.query;

    if (email && typeof email === "string") {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(200).json({
          success: true,
          data: [],
        });
      }

      const appointments = await prisma.appointment.findMany({
        where: {
          userId: user.id,
        },
        include: {
          user: true,
          doctor: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const formattedAppointments = appointments.map((appointment) => ({
        id: appointment.id,
        name: appointment.user.name,
        email: appointment.user.email,
        phone: appointment.user.phone,
        department: appointment.doctor.specialty,
        doctor: appointment.doctor.user.name,
        date: appointment.appointmentDate.toISOString().split("T")[0],
        time: appointment.appointmentDate.toTimeString().slice(0, 5),
        notes: appointment.notes,
        createdAt: appointment.createdAt,
        status: appointment.status,
      }));

      return res.status(200).json({
        success: true,
        data: formattedAppointments,
      });
    }

    res.status(200).json({
      success: true,
      data: [],
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
      error: error.message,
    });
  }
});

export default router;