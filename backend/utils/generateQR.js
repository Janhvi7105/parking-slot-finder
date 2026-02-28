import QRCode from "qrcode";

export const generateQR = async (booking) => {
  try {
    const qrData = `PSF|${booking._id}|${booking.paymentId}`;

    const qrImage = await QRCode.toDataURL(qrData);

    return qrImage;
  } catch (error) {
    console.error("❌ QR generation error:", error);
    throw error;
  }
};