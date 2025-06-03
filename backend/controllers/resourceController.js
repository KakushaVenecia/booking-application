// controllers/resourceController.js
const Resource = require('../models/Resource'); // Adjust path to your model

// Get all resources
exports.getAllResources = async (req, res) => {
    try {
    const resources = await Resource.find({});
    res.json(resources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single resource by ID
exports.getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findOne({ id: req.params.id });
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    res.status(200).json({
      success: true,
      data: resource
    });
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create new resource (optional)
exports.createResource = async (req, res) => {
  try {
    const resource = await Resource.create(req.body);
    res.status(201).json({
      success: true,
      data: resource
    });
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(400).json({
      success: false,
      message: 'Bad Request',
      error: error.message
    });
  }
};

// Update resource (optional)
exports.updateResource = async (req, res) => {
  try {
    const resource = await Resource.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    res.status(200).json({
      success: true,
      data: resource
    });
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(400).json({
      success: false,
      message: 'Bad Request',
      error: error.message
    });
  }
};

// Delete resource (optional)
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findOneAndDelete({ id: req.params.id });

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

