const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');


const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // Allow cookies
}));
app.use(express.json());
app.use(cookieParser());

// Connecting with Mongoose async/await approach:
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    console.log("Connected to DB:", mongoose.connection.name);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

//Calling the connection function
connectDB();

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/availability', require('./routes/availabilityRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/desks', require('./routes/deskRoutes'));

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));