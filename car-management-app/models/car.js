const mongoose = require('mongoose');
const User = require('../models/user');


const carSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  car_type: { type: String, required: true },
  car_company: { type: String, required: true },
  car_dealer: { type: String, required: true },
  images: { type: [String], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

carSchema.index({ 
  title: 'text', 
  description: 'text', 
  car_type: 'text', 
  car_company: 'text', 
  car_dealer: 'text' 
});

const Car = mongoose.model('Car',carSchema);

module.exports = Car;

