import transporter from "../config/mailer.js";

export const sendReceiptMail = async (toEmail, pdfBuffer) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: "Parking Booking Confirmed 🎉",
      text: "Your parking booking is confirmed. Receipt attached.",
      attachments: [
        {
          filename: "Parking_Receipt.pdf",
          content: pdfBuffer,
        },
      ],
    });

    console.log("📧 Receipt email sent");
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};