import express from "express";
import { readData, writeData } from "../utils/fileHandler.js";

const router = express.Router();
const FILE_NAME = "messages.json";

router.post("/", async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const messages = await readData(FILE_NAME);
    const newMessage = {
      id: Date.now(),
      name,
      email,
      phone,
      message,
      createdAt: new Date().toISOString(),
    };

    messages.push(newMessage);
    await writeData(FILE_NAME, messages);

    console.log("✓ New Contact Message Received:", newMessage);
    res.status(201).json({ success: true, message: "Message sent successfully", messageData: newMessage });
  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).json({ success: false, message: "Error saving message", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const messages = await readData(FILE_NAME);
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ success: false, message: "Error fetching messages", error: error.message });
  }
});

export default router;
