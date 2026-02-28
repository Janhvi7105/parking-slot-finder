import html_to_pdf from "html-pdf-node";

export const generateReceiptPDF = async (booking, qrImage) => {
  try {
    /* ================= SAFETY FALLBACKS ================= */
    const safeBooking = booking || {};

    const html = `
      <div style="font-family: Arial; padding: 20px;">
        <h2 style="color: green;">Parking Slot Finder</h2>
        <h3>Booking Confirmed ✅</h3>

        <p><b>Parking:</b> ${safeBooking.parkingName || "-"}</p>
        <p><b>Date:</b> ${safeBooking.bookingDate || "-"}</p>
        <p><b>Time:</b> ${safeBooking.fromTime || "-"} - ${
      safeBooking.toTime || "-"
    }</p>
        <p><b>Amount Paid:</b> ₹${safeBooking.amount ?? 0}</p>
        <p><b>Status:</b> Confirmed</p>

        <br/>
        ${
          qrImage
            ? `<img src="${qrImage}" width="140"/>`
            : `<p style="color:#888;">QR not available</p>`
        }
        <p>Scan this QR at parking entry</p>

        <hr/>
        <p>Thank you for using Parking Slot Finder 🚗</p>
      </div>
    `;

    const file = { content: html };
    const options = { format: "A4" };

    const pdfBuffer = await html_to_pdf.generatePdf(file, options);

    return pdfBuffer;
  } catch (error) {
    console.error("❌ Receipt PDF generation error:", error);
    throw error;
  }
};