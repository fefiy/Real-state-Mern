const Residency = require("../model/residency"); // Your Mongoose Residency model
const asyncHandler = require('express-async-handler');

// Create Residency
const createResidency = asyncHandler(async (req, res) => {
  console.log('Creating Residency');
  console.log(req.body);
  const {
    title,
    description,
    price,
    address,
    country,
    city,
    facilities,
    image,
    userEmail,
  } = req.body.data;
  // Assuming that "price" in the request is already a number.

  try {
    const residency = await Residency.create({
      title,
      description,
      price,
      address,
      country,
      city,
      facilities,
      image,
      userEmail, // Assuming "userEmail" is the user's email
    });

    res.json({ message: 'Residency created successfully', residency });
  } catch (err) {
    if (err.code === 11000) {
      // Assuming the error code for duplicate key is 11000
      res.status(400).json({ error: 'A Residency with the same address already exists' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Get all Residencies
const getAllResidencies = asyncHandler(async (req, res) => {
  console.log("get all residency")
  try{
    const residencies = await Residency.find().sort({ createdAt: 'desc' });
    console.log(residencies)
    res.json(residencies);
  }catch(err){
    throw Error(err.message);
  }
  
});

// Get a specific Residency by ID
const getResidency = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id)

  try {
    const residency = await Residency.findById(id);
    if (residency) {
      res.json(residency);
    } else {
      res.status(404).json({ error: 'Residency not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = {
  createResidency,
  getAllResidencies,
  getResidency,
};
