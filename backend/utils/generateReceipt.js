import puppeteer from "puppeteer";

export const generateReceiptPDF = async (booking, qrImage) => {
  let browser;

  try {
    console.log("🧾 PDF booking data:", booking);

    const safeBooking = booking || {};

    const safeQR =
      qrImage &&
      typeof qrImage === "string" &&
      qrImage.startsWith("data:image")
        ? qrImage
        : null;

    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Parking Receipt</title>
<style>
  body {
    font-family: Arial, sans-serif;
    padding: 24px;
    color: #000;
  }
  h2 { color: green; margin-bottom: 4px; }
  h3 { margin-top: 0; }
  p { margin: 6px 0; }
</style>
</head>
<body>
  <h2>Parking Slot Finder</h2>
  <h3>Booking Confirmed ✅</h3>

  <p><b>Parking:</b> ${safeBooking.parkingName || "-"}</p>
  <p><b>Vehicle Type:</b> ${safeBooking.vehicleType || "-"}</p>
  <p><b>Date:</b> ${safeBooking.bookingDate || "-"}</p>
  <p><b>Time:</b> ${safeBooking.fromTime || "-"} - ${safeBooking.toTime || "-"}</p>
  <p><b>Amount Paid:</b> ₹${safeBooking.amount ?? 0}</p>
  <p><b>Status:</b> Confirmed</p>

  <br/>

  ${
    safeQR
      ? `<img src="${safeQR}" width="140" />`
      : `<p style="color:#888;">QR not available</p>`
  }

  <p>Scan this QR at parking entry</p>

  <hr/>
  <p>Thank you for using Parking Slot Finder 🚗</p>
</body>
</html>
`;

    console.log("🚀 Launching Chrome for PDF...");

    browser = await puppeteer.launch({
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "domcontentloaded",
    });

    // small render wait (important on Windows)
    await new Promise((resolve) => setTimeout(resolve, 500));

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    console.log("📄 Generated PDF size:", pdfBuffer?.length || 0);

    return pdfBuffer;
  } catch (error) {
    console.error("❌ Receipt PDF generation error:", error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};