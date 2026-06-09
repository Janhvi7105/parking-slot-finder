import { GoogleGenerativeAI } from "@google/generative-ai";
import Parking from "../models/Parking.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🧠 memory (simple)
let chatHistory = [];

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.json({ reply: "Please type something." });

    const lowerMsg = message.toLowerCase();

    // ================= 1. HANDLE GREETING MANUALLY =================
    if (
      lowerMsg === "hi" ||
      lowerMsg === "hello" ||
      lowerMsg === "hey"
    ) {
      return res.json({
        reply:
          "Hello 👋 I’m your Parking Assistant! You can ask me things like:\n• Parking in Pune\n• Available slots\n• Cheapest parking 🚗",
      });
    }

    // ================= 2. DETECT PARKING QUERY =================
    const isParkingQuery =
      lowerMsg.includes("parking") ||
      lowerMsg.includes("slot") ||
      lowerMsg.includes("book");

    let parkingData = "";

    if (isParkingQuery) {
      const cities = ["pune", "akot", "nanded", "nashik"];
      const foundCity = cities.find((c) => lowerMsg.includes(c));

      let parkings = [];

      if (foundCity) {
        parkings = await Parking.find({
          location: { $regex: foundCity, $options: "i" },
        });
      } else {
        parkings = await Parking.find().limit(5);
      }

      if (parkings.length > 0) {
        parkingData = parkings
          .map(
            (p, i) =>
              `${i + 1}. ${p.name} (${p.location}) - ₹${p.price}/hour, ${p.capacity} slots`
          )
          .join("\n");
      } else {
        parkingData = "No parking found.";
      }
    }

    // ================= 3. GEMINI CHAT =================
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const chat = model.startChat({
      history: chatHistory,
    });

    const prompt = isParkingQuery
      ? `
User asked: "${message}"

Here is parking data:
${parkingData}

Explain clearly and suggest booking.
Keep it short and clean.
`
      : `
User asked: "${message}"

Reply like a helpful assistant.
Do NOT mention parking unless user asks.
Keep it natural like ChatGPT.
`;

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text().replace(/\*\*/g, "");

    // save memory
    chatHistory.push({ role: "user", parts: [{ text: message }] });
    chatHistory.push({ role: "model", parts: [{ text }] });

    if (chatHistory.length > 8) {
      chatHistory = chatHistory.slice(-8);
    }

    res.json({ reply: text });

  } catch (error) {
    console.error("❌ Gemini Error:", error);

    res.json({
      reply: "⚠️ Something went wrong. Please try again.",
    });
  }
};