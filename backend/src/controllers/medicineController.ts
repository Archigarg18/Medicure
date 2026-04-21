import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all medicines
export const getMedicines = async (req: Request, res: Response) => {
  try {
    const medicines = await prisma.medicine.findMany();
    res.json({ success: true, data: medicines });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create prescription
export const createPrescription = async (req: Request, res: Response) => {
  try {
    const { medicineId, quantity, dosage, instructions, roomNumber, bedNumber, amount } = req.body;
    
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const newPrescription = await prisma.prescription.create({
      data: {
        userId: req.userId,
        medicineId,
        quantity,
        dosage,
        instructions,
        roomNumber,
        bedNumber,
        amount,
      },
    });

    res.status(201).json({ success: true, data: newPrescription });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get prescriptions for a user
export const getUserPrescriptions = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const prescriptions = await prisma.prescription.findMany({
      where: { userId: req.userId },
      include: { medicine: true },
    });

    res.json({ success: true, data: prescriptions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
