import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/* ================= TRANSPORTER ================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ================= VERIFY (optional but useful) ================= */
transporter.verify()
  .then(() => {
    console.log("📧 Mail server is ready");
  })
  .catch((error) => {
    console.error("❌ Mailer error:", error);
  });

export default transporter;