const Car = require('../models/car');
const path = require('path');
const fs = require('fs');
const User = require('../models/user');
const mongoose = require('mongoose');


exports.createCar = async (req, res) => {
  try{
    const { title, description, car_type, car_company, car_dealer} = req.body;
    const image = req.files  // Store the image path
    console.log(title, description, car_type, car_company, car_dealer, image, "printing from controller");
    const imagePaths = image.map(file => file.path);
    console.log(req.user, "controller");
    const userId = new mongoose.Types.ObjectId(req.user);
    console.log(userId);
    const newCar = new Car({
      title, 
      description, 
      car_type, 
      car_company, 
      car_dealer,
      images: imagePaths,  // Store image file paths
      user: userId // Assuming JWT middleware attaches user info
    });  
    
    console.log(newCar);

    const savedCar = await newCar.save();
      res.status(201).json(savedCar);
  } 
  catch (error) {
    console.error('Error creating car:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getCarById = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user);
    const car = await Car.find({user: userId});
    res.status(200).json(car);
  } catch (err) {
    res.status(404).json({ error: 'Car not found' });
  }
};

exports.updateCar = async (req, res) => {
  try {
    // Extract carId from query parameters
    const {carData, carId } = req.body;
    const {title, description, car_type, car_company, car_dealer} = carData;
    console.log(title, description, car_type, car_company, car_dealer, carId);
    
    console.log(carId, "update");

    // Ensure the carId is valid and cast it to ObjectId
    const CarId = new mongoose.Types.ObjectId(carId);

    // Extract fields from request body
    // Create an update object and only add fields that are provided
    const updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (car_type) updateFields.car_type = car_type;
    if (car_dealer) updateFields.car_dealer = car_dealer;
    if (car_company) updateFields.car_company = car_company;


    console.log(updateFields);
    // Find the car by id and update it
    const updatedCar = await Car.findByIdAndUpdate(
      CarId,
      updateFields,
      { new: true, runValidators: true }
    );
    console.log(updatedCar);
    // If the car was not found, return a 404 response
    if (!updatedCar) {
      return res.status(404).json({ error: 'Car not found' });
    }

    // Return the updated car
    res.status(200).json(updatedCar);
  } catch (err) {
    // Log the error and return a detailed response
    console.error("Error updating car:", err);
    res.status(400).json({ error: 'Unable to update car', details: err.message });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const {carId } = req.body;
    const CarId = new mongoose.Types.ObjectId(carId);
    console.log(CarId, req.body.carId);
    await Car.findByIdAndDelete(CarId);
    res.status(200).json({ message: 'Car deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Unable to delete car' });
  }
};



exports.searchCars = async (req, res) => {
  const { q } = req.query;
  
  try {
    const cars = await Car.find({ $text: { $search: q } });
    console.log(cars)
    if (cars.length === 0) {
      return res.status(404).json({ message: 'No cars found matching your search.' });
    }
    res.status(200).json(cars);
  } catch (err) {
    console.error('Error searching cars:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

