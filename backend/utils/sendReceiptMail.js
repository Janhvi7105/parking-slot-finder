import transporter from "../config/mailer.js";

export const sendReceiptMail = async (toEmail, pdfBuffer) => {
  try {
    // ================= SAFE EMAIL =================
    const safeEmail =
      typeof toEmail === "string" ? toEmail.trim() : "";

    console.log("📨 Sending receipt to:", safeEmail);

    if (!safeEmail || !safeEmail.includes("@")) {
      console.log("❌ Invalid email. Receipt not sent.");
      return;
    }

    // ================= SAFE PDF =================
    let safeBuffer;

    if (Buffer.isBuffer(pdfBuffer)) {
      safeBuffer = pdfBuffer;
    } else if (pdfBuffer) {
      safeBuffer = Buffer.from(pdfBuffer);
    } else {
      console.log("⚠️ PDF missing. Creating fallback PDF.");
      safeBuffer = Buffer.from("Receipt unavailable");
    }

    console.log("📎 PDF Size:", safeBuffer.length);

    // ================= SEND EMAIL =================
    const info = await transporter.sendMail({
      from: `"Parking Slot Finder" <${process.env.EMAIL_FROM}>`,
      to: safeEmail,
      subject: "Parking Booking Confirmed 🎉",
      text: `
Hello,

Your parking booking has been confirmed successfully.

Please find your receipt attached.

Thank you for using Parking Slot Finder.

Regards,
Parking Slot Finder Team
      `,
      attachments: [
        {
          filename: "Parking_Receipt.pdf",
          content: safeBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    console.log("✅ Receipt email sent successfully");
    console.log("📧 Message ID:", info.messageId);
  } catch (error) {
    console.error("❌ Email sending failed:");
    console.error(error);
  }
};