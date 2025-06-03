const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  date: String,
  type: String, // remote, al, nwd, training, etc.
  period: String // am, pm, full
});

module.exports = mongoose.model('Availability', availabilitySchema);