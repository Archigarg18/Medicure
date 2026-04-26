import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createContactMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newMessage = await prisma.contact.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
        status: "new"
      }
    });

    console.log("✓ New Contact Message Received:", newMessage);
    res.status(201).json({ success: true, message: "Message sent successfully", messageData: newMessage });
  } catch (error: any) {
    console.error("Error saving contact message:", error);
    res.status(500).json({ success: false, message: "Error saving message", error: error.message });
  }
};

export const getContactMessages = async (req: Request, res: Response) => {
  try {
    const messages = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" }
    });
    res.status(200).json({ success: true, data: messages });
  } catch (error: any) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ success: false, message: "Error fetching messages", error: error.message });
  }
};
