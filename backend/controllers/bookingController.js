const Booking = require("../models/Booking");

exports.bookSlot = async (req, res) => {
  const booking = await Booking.create(req.body);
  res.json(booking);
};
