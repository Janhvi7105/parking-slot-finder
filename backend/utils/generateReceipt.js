import PDFDocument from "pdfkit";

export const generateReceiptPDF = async (booking, qrImage) => {
  return new Promise((resolve, reject) => {
    try {
      console.log("🧾 Generating PDF using PDFKit...");

      const safeBooking = booking || {};

      const doc = new PDFDocument({
        margin: 50,
        size: "A4",
      });

      const buffers = [];

      doc.on("data", (chunk) => buffers.push(chunk));

      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        console.log("📄 Generated PDF size:", pdfBuffer.length);
        resolve(pdfBuffer);
      });

      doc.on("error", (err) => {
        reject(err);
      });

      // ================= HEADER =================

      doc
        .fontSize(24)
        .fillColor("green")
        .text("Parking Slot Finder", {
          align: "center",
        });

      doc.moveDown();

      doc
        .fontSize(18)
        .fillColor("black")
        .text("Booking Confirmation Receipt", {
          align: "center",
        });

      doc.moveDown(2);

      // ================= BOOKING DETAILS =================

      doc.fontSize(13);

      doc.text(`Parking Name : ${safeBooking.parkingName || "-"}`);
      doc.moveDown();

      doc.text(`Location : ${safeBooking.location || "-"}`);
      doc.moveDown();

      doc.text(`Vehicle Type : ${safeBooking.vehicleType || "-"}`);
      doc.moveDown();

      doc.text(`Booking Date : ${safeBooking.bookingDate || "-"}`);
      doc.moveDown();

      doc.text(
        `Time : ${safeBooking.fromTime || "-"}  -  ${safeBooking.toTime || "-"}`
      );
      doc.moveDown();

      doc.text(`Amount Paid : ₹${safeBooking.amount || 0}`);
      doc.moveDown();

      doc.text(`Payment ID : ${safeBooking.paymentId || "-"}`);
      doc.moveDown();

      doc.text(`Status : ${safeBooking.status || "Confirmed"}`);
      doc.moveDown(2);

      // ================= QR CODE =================

      if (
        qrImage &&
        typeof qrImage === "string" &&
        qrImage.startsWith("data:image")
      ) {
        try {
          const base64 = qrImage.replace(
            /^data:image\/png;base64,/,
            ""
          );

          const qrBuffer = Buffer.from(base64, "base64");

          doc.image(qrBuffer, {
            fit: [140, 140],
            align: "center",
          });

          doc.moveDown();

          doc.text("Scan this QR at Parking Entry", {
            align: "center",
          });
        } catch (err) {
          console.log("QR image could not be added.");
        }
      }

      // ================= FOOTER =================

      doc.moveDown(3);

      doc
        .fontSize(14)
        .fillColor("green")
        .text("Thank you for using Parking Slot Finder!", {
          align: "center",
        });

      doc.end();
    } catch (error) {
      console.error("❌ PDF Generation Error:", error);
      reject(error);
    }
  });
};