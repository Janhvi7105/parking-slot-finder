import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/* ================= DEBUG ================= */
console.log("SMTP_HOST:", process.env.SMTP_HOST);
console.log("SMTP_PORT:", process.env.SMTP_PORT);
console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_PASS exists:", !!process.env.SMTP_PASS);
console.log("BREVO_API_KEY exists:", !!process.env.BREVO_API_KEY);

/* ================= TRANSPORTER ================= */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  requireTLS: true,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

/* ================= VERIFY ================= */
transporter
  .verify()
  .then(() => {
    console.log("✅ Brevo SMTP Connected");
  })
  .catch((err) => {
    console.error("❌ SMTP Error:", err);
  });

export default transporter;