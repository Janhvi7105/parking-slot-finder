import { BrevoClient } from "@getbrevo/brevo";

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

export const sendReceiptMail = async (toEmail, pdfBuffer) => {
  try {
    const safeEmail =
      typeof toEmail === "string" ? toEmail.trim() : "";

    console.log("📨 Sending receipt to:", safeEmail);

    if (!safeEmail || !safeEmail.includes("@")) {
      console.log("❌ Invalid email");
      return;
    }

    let safeBuffer;

    if (Buffer.isBuffer(pdfBuffer)) {
      safeBuffer = pdfBuffer;
    } else if (pdfBuffer) {
      safeBuffer = Buffer.from(pdfBuffer);
    } else {
      safeBuffer = Buffer.from("Receipt unavailable");
    }

    console.log("📎 PDF Size:", safeBuffer.length);

    const response =
      await brevo.transactionalEmails.sendTransacEmail({
        sender: {
          name: "Parking Slot Finder",
          email: process.env.EMAIL_FROM,
        },

        to: [
          {
            email: safeEmail,
          },
        ],

        subject: "Parking Booking Confirmed 🎉",

        textContent: `
Hello,

Your parking booking has been confirmed successfully.

Please find your receipt attached.

Thank you for using Parking Slot Finder.
`,

        htmlContent: `
<h2>Parking Booking Confirmed ✅</h2>

<p>Your parking booking has been confirmed successfully.</p>

<p>Please find your receipt attached.</p>

<p>Thank you for using <b>Parking Slot Finder</b>.</p>
`,

        attachment: [
          {
            name: "Parking_Receipt.pdf",
            content: safeBuffer.toString("base64"),
          },
        ],
      });

    console.log("✅ Email sent");
    console.log(response);
  } catch (err) {
    console.error("❌ Brevo API Error");
    console.error(err);
  }
};