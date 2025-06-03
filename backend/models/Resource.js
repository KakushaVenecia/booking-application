// models/Resource.js
const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // e.g. "D1"
  x: Number,
  y: Number,
});

module.exports = mongoose.model("Resource", resourceSchema);
