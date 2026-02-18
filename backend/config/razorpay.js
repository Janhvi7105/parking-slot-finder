import Razorpay from "razorpay";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load backend/.env explicitly
dotenv.config({ path: path.join(__dirname, "../.env") });

// Validate environment variables
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error("❌ Razorpay keys missing in .env");
  process.exit(1);
}

// Create Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Optional debug (keep during development)
console.log("✅ Razorpay initialized with key:", process.env.RAZORPAY_KEY_ID);

export default razorpay;
