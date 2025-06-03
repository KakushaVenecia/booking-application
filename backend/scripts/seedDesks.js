const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Resource = require('../models/Resource.js'); 

dotenv.config(); 

const deskData = [
  { id: "D1", x: 400, y: 95 },
  { id: "D2", x: 235, y: 290 },
  { id: "D3", x: 45, y: 260 },
  { id: "D4", x: 275, y: 190 },
  { id: "D5", x: 235, y: 190 },
  { id: "D6", x: 102, y: 140 },
  { id: "D7", x: 20, y: 180 },
  { id: "D8", x: 20, y: 140 },
  { id: "D9", x: 20, y: 60 },
  { id: "D10", x: 20, y: 20 },
  { id: "D11", x: 102, y: 20 },
  { id: "MMR", x: 502, y: 80 },
  { id: "SMR", x: 502, y: 170 },
];


async function seedDesks() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Resource.deleteMany(); // Optional: clear previous
    await Resource.insertMany(deskData);
    console.log('✅ Desk resources seeded');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding desks:', err);
    process.exit(1);
  }
}

seedDesks();