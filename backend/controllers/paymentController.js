/* =====================================================
   VERIFY PAYMENT + SAVE BOOKING
===================================================== */
export const verifyPayment = async (req, res) => {
  try {
    // ⭐ SAFER destructuring (prevents undefined issues)
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingData = {},
    } = req.body;

    /* 🔍 DEBUG LOGS */
    console.log("🔥 FULL req.body:", req.body);
    console.log("📩 verifyPayment bookingData:", bookingData);

    /* 🔐 SIGNATURE VERIFY */
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    console.log("🔐 Expected signature:", expectedSignature);
    console.log("🔐 Received signature:", razorpay_signature);

    if (expectedSignature !== razorpay_signature) {
      console.log("❌ Signature mismatch");

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    /* =====================================================
       ⭐ PREVENT DUPLICATE BOOKINGS
    ===================================================== */
    const existingBooking = await Booking.findOne({
      orderId: razorpay_order_id,
    });

    if (existingBooking) {
      console.log("⚠️ Duplicate booking prevented:", existingBooking._id);

      return res.status(200).json({
        success: true,
        message: "Booking already exists",
        booking: existingBooking,
      });
    }

    /* =====================================================
       ⭐ HARD GUARANTEE EMAIL (ULTRA SAFE)
    ===================================================== */
    const cleanedEmail =
      bookingData?.userEmail &&
      String(bookingData.userEmail).trim() !== ""
        ? String(bookingData.userEmail).trim().toLowerCase()
        : "test@example.com";

    console.log("🧪 FINAL EMAIL TO SAVE:", cleanedEmail);

    // ⭐ remove email from spread to avoid overwrite
    const bookingPayload = { ...(bookingData || {}) };
    delete bookingPayload.userEmail;

    /* =====================================================
       ✅ PAYMENT VERIFIED — SAVE BOOKING (BULLETPROOF)
    ===================================================== */

    // Step 1 — create mongoose document
    const newBooking = new Booking({
      ...bookingPayload,
      userName: bookingData?.userName || "Test User",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: "Reserved",
      receiptUrl: "",
      feedbackSubmitted: false,
    });

    // ⭐⭐⭐ CRITICAL — force email AFTER model creation ⭐⭐⭐
    newBooking.userEmail = cleanedEmail;

    // Step 3 — save
    await newBooking.save();

    console.log("✅ Booking saved after payment:", newBooking._id);
    console.log("📧 Saved booking email:", newBooking.userEmail);

    return res.status(200).json({
      success: true,
      message: "Payment verified & booking reserved",
      booking: newBooking,
    });
  } catch (error) {
    console.error("❌ Payment verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};