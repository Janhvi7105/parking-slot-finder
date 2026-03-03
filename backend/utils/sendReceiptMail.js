import transporter from "../config/mailer.js";

export const sendReceiptMail = async (toEmail, pdfBuffer) => {
  try {
    /* ================= SAFE EMAIL GUARD ================= */
    const safeEmail =
      typeof toEmail === "string" ? toEmail.trim() : "";

    console.log("📨 sending email to:", safeEmail);
    console.log("📎 Incoming PDF buffer length:", pdfBuffer?.length);

    // ❗ Prevent invalid email
    if (!safeEmail || !safeEmail.includes("@")) {
      console.log("❌ Invalid or empty email — mail skipped");
      return;
    }

    /* ================= SAFE BUFFER ================= */
    let safeBuffer;

    if (Buffer.isBuffer(pdfBuffer)) {
      safeBuffer = pdfBuffer;
    } else if (pdfBuffer) {
      safeBuffer = Buffer.from(pdfBuffer);
    } else {
      console.log("⚠️ No PDF provided — creating empty fallback");
      safeBuffer = Buffer.from("Receipt unavailable");
    }

    console.log("📎 Final PDF buffer length:", safeBuffer.length);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: safeEmail,
      subject: "Parking Booking Confirmed 🎉",
      text: "Your parking booking is confirmed. Receipt attached.",
      attachments: [
        {
          filename: "Parking_Receipt.pdf",
          content: safeBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    console.log("📧 Receipt email sent successfully");
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
};