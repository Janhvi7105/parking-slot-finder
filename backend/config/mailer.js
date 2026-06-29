import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
  family: 4, // Force IPv4 instead of IPv6
});

transporter
  .verify()
  .then(() => {
    console.log("📧 Mail server is ready");
  })
  .catch((error) => {
    console.error("❌ Mailer error:", error);
  });

export default transporter;