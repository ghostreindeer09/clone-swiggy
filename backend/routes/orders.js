const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');

// Get all orders
router.get('/', auth, (req, res) => {
  res.send('Get all orders');
});

// Create a new order
router.post('/', auth, async (req, res) => {
  const { restaurant, items, total } = req.body;

  try {
    const newOrder = new Order({
      user: req.user.id,
      restaurant,
      items,
      total,
    });

    const order = await newOrder.save();

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
