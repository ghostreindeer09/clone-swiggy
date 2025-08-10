const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Menu = require('../models/Menu');

// Get all menus for a restaurant
router.get('/:restaurantId/menus', auth, async (req, res) => {
  try {
    const menus = await Menu.find({ restaurant: req.params.restaurantId });
    res.json(menus);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
