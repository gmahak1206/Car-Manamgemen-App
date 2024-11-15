const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const { createCar, getCarById, updateCar, deleteCar, searchCars } = require('../controllers/carController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const router = express.Router();
const { CloudinaryStorage } = require('multer-storage-cloudinary');

console.log(process.env.CLOUDINARY_CLOUD_NAME, "process");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cars', // Folder in Cloudinary to store images
    allowed_formats: ['jpg', 'jpeg', 'png'], // Limit allowed formats
  },
});

const upload = multer({ storage });


// 'image' must match the field name used in the FormData on the frontend
router.post('/create', authMiddleware, upload.array('image', 10), createCar);
router.get('/', authMiddleware, getCarById);
router.post('/update', authMiddleware, updateCar);
router.post('/delete', authMiddleware, deleteCar);
router.get('/search', authMiddleware, searchCars);

module.exports = router;
