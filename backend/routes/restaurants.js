const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Restaurant = require('../models/Restaurant');

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Restaurant not found' });
    }

    res.status(500).send('Server Error');
  }
});

module.exports = router;
