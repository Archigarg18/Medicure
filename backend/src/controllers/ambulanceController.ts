import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all ambulances
export const getAmbulances = async (req: Request, res: Response) => {
  try {
    const ambulances = await prisma.ambulance.findMany();
    res.json({ success: true, data: ambulances });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Request an ambulance
export const requestAmbulance = async (req: Request, res: Response) => {
  try {
    const { pickupLocation, dropoffLocation, urgency } = req.body;
    
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const newRequest = await prisma.ambulanceRequest.create({
      data: {
        userId: req.userId,
        pickupLocation,
        dropoffLocation,
        urgency: urgency || "normal",
      },
    });

    res.status(201).json({ success: true, data: newRequest });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get requests for a user
export const getUserRequests = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const requests = await prisma.ambulanceRequest.findMany({
      where: { userId: req.userId },
      include: { ambulance: true },
    });

    res.json({ success: true, data: requests });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
