const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    required: true
  },
  deskId: {
    type: String,
    required: true
  },
  day: {
    type: String,
    required: true,
    enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    default: '09:30'
  },
  endTime: {
    type: String,
    default: '17:30'
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed'],
    default: 'active'
  },
  bookingType: {
    type: String,
    enum: ['daily', 'recurring', 'temporary'],
    default: 'daily'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to prevent double booking
bookingSchema.index({ deskId: 1, day: 1, date: 1 }, { unique: true });
// Index for efficient user queries
bookingSchema.index({ user: 1, status: 1 });
// Index for date-based queries
bookingSchema.index({ date: 1, status: 1 });
// Pre-save middleware to update the updatedAt field
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
// Instance method to check if booking is for today
bookingSchema.methods.isToday = function() {
  const today = new Date();
  return this.date.toDateString() === today.toDateString();
};
// Instance method to check if booking is active
bookingSchema.methods.isActive = function() {
  return this.status === 'active' && this.date >= new Date();
};

// Static method to find bookings by week
bookingSchema.statics.findByWeek = function(startDate, endDate) {
  return this.find({
    date: {
      $gte: startDate,
      $lte: endDate
    },
    status: 'active'
  }).populate('user', 'name email').populate('resource', 'id type');
};

// Static method to find user's active bookings
bookingSchema.statics.findActiveByUser = function(userId) {
  return this.find({
    user: userId,
    status: 'active',
    date: { $gte: new Date() }
  }).populate('resource', 'id type x y');
};

// Static method to check if desk is available
bookingSchema.statics.isDeskAvailable = function(deskId, day, date) {
  return this.findOne({
    deskId: deskId,
    day: day,
    date: date,
    status: 'Booked'
  }).then(booking => !booking);
};

// Static method to get weekly booking summary
bookingSchema.statics.getWeeklySummary = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate },
        status: 'active'
      }
    },
    {
      $group: {
        _id: '$day',
        totalBookings: { $sum: 1 },
        uniqueUsers: { $addToSet: '$user' },
        desks: { $addToSet: '$deskId' }
      }
    },
    {
      $project: {
        day: '$_id',
        totalBookings: 1,
        uniqueUsers: { $size: '$uniqueUsers' },
        totalDesks: { $size: '$desks' }
      }
    },
    {
      $sort: { day: 1 }
    }
  ]);
};

module.exports = mongoose.model('Booking', bookingSchema);