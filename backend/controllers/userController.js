const User = require('../models/User'); 
const bcryptjs = require('bcryptjs');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Hash password
    const passwordHash = await bcryptjs.hash(password, 10);

    const newUser = new User({
      email,
      username,
      passwordHash,
    });

    await newUser.save();
    res.status(201).json({ message: 'User created', userId: newUser._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-passwordHash'); // exclude passwordHash
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user info (not password)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true }).select('-passwordHash');
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
