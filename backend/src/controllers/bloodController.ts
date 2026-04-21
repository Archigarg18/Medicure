import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all blood stock
export const getBloodStock = async (req: Request, res: Response) => {
  try {
    const stock = await prisma.bloodStock.findMany();
    res.json({ success: true, data: stock });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Request blood
export const requestBlood = async (req: Request, res: Response) => {
  try {
    const { bloodType, quantity, urgency, roomNumber, bedNumber } = req.body;
    
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const newRequest = await prisma.bloodRequest.create({
      data: {
        userId: req.userId,
        bloodType,
        quantity,
        urgency: urgency || "normal",
        roomNumber,
        bedNumber,
      },
    });

    res.status(201).json({ success: true, data: newRequest });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get requests for a user
export const getUserBloodRequests = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const requests = await prisma.bloodRequest.findMany({
      where: { userId: req.userId },
      include: { bloodStock: true },
    });

    res.json({ success: true, data: requests });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
