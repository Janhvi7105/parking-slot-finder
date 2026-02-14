const router = require("express").Router();
const { bookSlot } = require("../controllers/bookingController");

router.post("/book", bookSlot);

module.exports = router;
