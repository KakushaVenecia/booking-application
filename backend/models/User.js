const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: String,
  passwordHash: String,
  defaultWorkSchedule: [Number],
  role: { type: String, default: 'user' },
  resetPasswordToken: String,
  resetPasswordExpires: Date,

});

module.exports = mongoose.model('User', userSchema);