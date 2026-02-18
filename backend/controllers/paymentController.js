import razorpay from "../config/razorpay.js";

export const createOrder = async (req, res) => {
  try {
    console.log("Payment request body:", req.body);

    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    const options = {
      amount: amount * 100, // rupees → paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    console.log("Razorpay order created:", order.id);

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("❌ Razorpay ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Razorpay order creation failed",
      error: error.error?.description || error.message,
    });
  }
};
