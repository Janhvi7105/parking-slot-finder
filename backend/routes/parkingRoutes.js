import express from "express";
import Parking from "../models/Parking.js";

const router = express.Router();

/* ADD PARKING */
router.post("/add", async (req, res) => {
  try {
    const parking = new Parking(req.body);
    await parking.save();
    res.status(201).json(parking);
  } catch {
    res.status(500).json({ message: "Error adding parking" });
  }
});

/* GET ALL PARKINGS */
router.get("/", async (req, res) => {
  const parkings = await Parking.find();
  res.json(parkings);
});

/* GET SINGLE PARKING (FOR EDIT PAGE) */
router.get("/:id", async (req, res) => {
  try {
    const parking = await Parking.findById(req.params.id);
    res.json(parking);
  } catch {
    res.status(404).json({ message: "Parking not found" });
  }
});

/* UPDATE PARKING */
router.put("/:id", async (req, res) => {
  try {
    const updatedParking = await Parking.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        location: req.body.location,
        capacity: req.body.capacity,
        price: req.body.price,
      },
      { new: true }
    );
    res.json(updatedParking);
  } catch {
    res.status(500).json({ message: "Error updating parking" });
  }
});

/* DELETE PARKING */
router.delete("/:id", async (req, res) => {
  await Parking.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
