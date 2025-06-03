const Booking = require("../models/Booking");



exports.bookDesk = async (req, res) => {
  const { deskId, day } = req.body;

  try {
    const exists = await Booking.findOne({ deskId, day });
    if (exists) return res.status(400).send("Desk already booked");

    const booking = new Booking({
      user: req.user._id,
      deskId,
      day,
    });

    await booking.save();
    res.redirect("/desks");
  } catch (err) {
    console.error(err);
    res.status(500).send("Booking failed");
  }
};
