import express from "express";
import { readData, writeData } from "../utils/fileHandler.js";

const router = express.Router();
const FILE_NAME = "messages.json";

router.post("/", async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const messages = await readData(FILE_NAME);
    const newMessage = {
      id: Date.now(),
      name,
      email,
      phone,
      message,
      createdAt: new Date(),
    };

    messages.push(newMessage);
    await writeData(FILE_NAME, messages);

    console.log("New Contact Message Received:", newMessage);
    res.status(201).json({ message: "Message sent successfully", messageData: newMessage });
  } catch (error) {
    res.status(500).json({ message: "Error saving message" });
  }
});

router.get("/", async (req, res) => {
  try {
    const messages = await readData(FILE_NAME);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});

export default router;
