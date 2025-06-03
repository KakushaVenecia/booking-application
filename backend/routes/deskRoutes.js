const express = require("express");
const router = express.Router();
const { bookDesk } = require("../controllers/deskController");
const auth = require('../middleware/auth');

router.use(auth);

// POST /desks/book → book a desk
router.post("/book", bookDesk);

module.exports = router;
