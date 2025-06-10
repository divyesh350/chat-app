import Groq from 'groq-sdk';
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Get or create AI user
export const getOrCreateAIUser = async () => {
  try {
    let aiUser = await User.findOne({ isAI: true });
    
    if (aiUser) {
      console.log("AI User already exists:", aiUser.fullName);
    } else {
      aiUser = await User.create({
        email: "blinkchat@ai.com",
        fullName: "Blink Chat AI",
        password: "ai_password_placeholder", // This won't be used for login
        profilePic: "/ai-avatar.png", // Set to .png
        isAI: true
      });
    }
    
    return aiUser;
  } catch (error) {
    console.error("Error in getOrCreateAIUser:", error);
    throw error;
  }
};

// Handle AI chat messages
export const handleAIMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const senderId = req.user._id;
    
    // Get AI user
    const aiUser = await getOrCreateAIUser();
    const receiverId = aiUser._id;

    // Save user's message
    const userMessage = new Message({
      senderId,
      receiverId,
      text
    });
    await userMessage.save();

    // Get AI response
    const completion = await groq.chat.completions.create({
      model: "allam-2-7b", // Updated to a supported Groq model
      messages: [
        {
          role: "system",
          content: "You are Blink Chat AI, a friendly and helpful AI assistant. Keep your responses casual, fun, and engaging. Be concise but informative."
        },
        {
          role: "user",
          content: text
        }
      ],
      max_tokens: 150
    });

    const aiResponse = completion.choices[0].message.content;

    // Save AI's response
    const aiMessage = new Message({
      senderId: receiverId,
      receiverId: senderId,
      text: aiResponse
    });
    await aiMessage.save();

    // Send real-time message to user
    const receiverSocketId = getReceiverSocketId(senderId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", aiMessage);
    }

    res.status(201).json(aiMessage);
  } catch (error) {
    console.error("Error in handleAIMessage:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}; 