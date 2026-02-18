import Booking from "../models/Booking.js";

/* =====================================================
   ❌ IMPORTANT
   Booking is CREATED ONLY after Razorpay verification
   (inside paymentRoutes.js)
   DO NOT create booking here
===================================================== */

/* =====================================================
   USER: GET MY BOOKINGS
   GET /api/bookings/my-bookings/:userId
===================================================== */
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.params.userId?.trim();

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const bookings = await Booking.find({ userId }).sort({
      createdAt: -1, // latest first
    });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("❌ Fetch user bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

/* =====================================================
   ADMIN: GET ALL BOOKINGS
   GET /api/bookings/admin/all
===================================================== */
export const getAllBookingsForAdmin = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("❌ Fetch admin bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

/* =====================================================
   ADMIN: CONFIRM BOOKING
   PUT /api/bookings/admin/confirm/:bookingId
   ✅ Uses updateOne() → NO validation
===================================================== */
export const confirmBookingByAdmin = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "Reserved") {
      return res.status(400).json({
        success: false,
        message: "Only reserved bookings can be confirmed",
      });
    }

    // ✅ NO validation triggered
    await Booking.updateOne(
      { _id: bookingId },
      {
        $set: {
          status: "Confirmed",
          confirmedAt: new Date(),
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Booking confirmed successfully",
    });
  } catch (error) {
    console.error("❌ Admin confirm error:", error);
    res.status(500).json({
      success: false,
      message: "Confirmation failed",
    });
  }
};

/* =====================================================
   ADMIN: CANCEL BOOKING
   PUT /api/bookings/admin/cancel/:bookingId
   ✅ Uses updateOne() → NO validation
===================================================== */
export const cancelBookingByAdmin = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "Reserved") {
      return res.status(400).json({
        success: false,
        message: "Only reserved bookings can be cancelled",
      });
    }

    // ✅ NO validation triggered
    await Booking.updateOne(
      { _id: bookingId },
      {
        $set: {
          status: "Cancelled",
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("❌ Admin cancel error:", error);
    res.status(500).json({
      success: false,
      message: "Cancellation failed",
    });
  }
};
