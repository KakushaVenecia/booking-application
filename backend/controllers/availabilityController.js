const Availability = require('../models/Availability'); 

// Create new availability
exports.createAvailability = async (req, res) => {
  try {
    const { date, type, period } = req.body;
    const userId = req.user.id;
    const availability = new Availability({ userId, date, type, period });
    await availability.save();
    res.status(201).json(availability);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all availabilities for a specific user
exports.getUserAvailability = async (req, res) => {
  try {
    const { userId } = req.params;
    const records = await Availability.find({ userId });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a specific availability by ID
exports.updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Availability.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a specific availability by ID
exports.deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    await Availability.findByIdAndDelete(id);
    res.status(200).json({ message: 'Availability deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
