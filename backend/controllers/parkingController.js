const Parking = require("../models/Parking");

exports.addParking = async (req, res) => {
  const parking = await Parking.create(req.body);
  res.json(parking);
};

exports.getAllParking = async (req, res) => {
  const slots = await Parking.find();
  res.json(slots);
};
