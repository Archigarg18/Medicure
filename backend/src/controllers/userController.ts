import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateToken } from "../middleware/auth.js";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone, role, profilePic } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        profilePic,
        role: role || "user",
      },
    });

    // Auto-create Doctor profile if registering as doctor
    if (user.role === "doctor") {
      const { specialty, experience, consultationFee } = req.body;
      await prisma.doctor.create({
        data: {
          userId: user.id,
          specialty: specialty || "General",
          experience: parseInt(experience) || 0,
          consultationFee: parseFloat(consultationFee) || 0,
          status: "approved", // Auto-approved for now
          availableSlots: []
        }
      });
    }

    const token = generateToken(user.id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role, profilePic: user.profilePic },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    if (user.role === "doctor") {
      const doctorProfile = await prisma.doctor.findUnique({ where: { userId: user.id } });
      if (!doctorProfile) {
         return res.status(400).json({ success: false, message: "Doctor profile not found" });
      }
      if (doctorProfile.status !== "approved") {
         return res.status(403).json({ success: false, message: "Your account is waiting for Admin approval." });
      }
    }

    const token = generateToken(user.id, user.role);

    res.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role, profilePic: user.profilePic },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, name: true, phone: true, role: true, createdAt: true },
    });
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
