import { Request, Response } from "express";
import { prisma } from "../server";

// Get all doctors with filters
export const getDoctors = async (req: Request, res: Response) => {
  try {
    const { specialty, page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (specialty) {
      where.specialty = {
        contains: specialty as string,
        mode: "insensitive",
      };
    }

    const doctors = await prisma.doctor.findMany({
      where,
      skip,
      take: Number(limit),
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    const total = await prisma.doctor.count({ where });

    res.json({
      success: true,
      data: doctors,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching doctors",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get single doctor
export const getDoctor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        appointments: {
          select: {
            id: true,
            appointmentDate: true,
            status: true,
          },
        },
      },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching doctor",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Create doctor (admin only)
export const createDoctor = async (req: Request, res: Response) => {
  try {
    const { userId, specialty, experience, consultationFee, bio } = req.body;

    const doctor = await prisma.doctor.create({
      data: {
        userId,
        specialty,
        experience: Number(experience),
        consultationFee: Number(consultationFee),
        bio,
        availableSlots: [],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating doctor",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update doctor
export const updateDoctor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { specialty, experience, consultationFee, bio, rating } = req.body;

    const doctor = await prisma.doctor.update({
      where: { id },
      data: {
        ...(specialty && { specialty }),
        ...(experience && { experience: Number(experience) }),
        ...(consultationFee && { consultationFee: Number(consultationFee) }),
        ...(bio && { bio }),
        ...(rating && { rating: Number(rating) }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: "Doctor updated successfully",
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating doctor",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete doctor
export const deleteDoctor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.doctor.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting doctor",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
