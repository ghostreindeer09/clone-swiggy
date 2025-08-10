const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Enable CORS
app.use(cors());

// Connect to MongoDB
connectDB();

app.use(express.json());

const port = 3000;

const restaurantsRouter = require('./routes/restaurants');
const menusRouter = require('./routes/menus');
const ordersRouter = require('./routes/orders');
const usersRouter = require('./routes/users');

app.use('/restaurants', restaurantsRouter);
app.use('/menus', menusRouter);
app.use('/orders', ordersRouter);
app.use('/users', usersRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
