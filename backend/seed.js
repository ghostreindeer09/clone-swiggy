const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const Menu = require('./models/Menu');
const Order = require('./models/Order');
const User = require('./models/User'); // Assuming you have a User model

const MONGODB_URI = 'mongodb://localhost:27017/swiggy'; // Replace with your MongoDB connection string

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected');

    // Clear existing data
    await Restaurant.deleteMany({});
    await Menu.deleteMany({});
    await Order.deleteMany({});
    await User.deleteMany({});

    // Create a user
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password', // Remember to hash passwords in a real application
    });
    await user.save();

    // Create restaurants
    const restaurants = [
      { name: 'Pizza Palace', cuisine: 'Italian' },
      { name: 'Burger Barn', cuisine: 'American' },
      { name: 'Taco Town', cuisine: 'Mexican' },
    ];
    const createdRestaurants = await Restaurant.insertMany(restaurants);

    // Create menus for each restaurant
    const menus = [
      // Pizza Palace
      {
        restaurant: createdRestaurants[0]._id,
        name: 'Margherita Pizza',
        description: 'Classic cheese and tomato pizza',
        price: 12.99,
        image: 'https://via.placeholder.com/150',
      },
      {
        restaurant: createdRestaurants[0]._id,
        name: 'Pepperoni Pizza',
        description: 'Pizza with pepperoni topping',
        price: 14.99,
        image: 'https://via.placeholder.com/150',
      },
      // Burger Barn
      {
        restaurant: createdRestaurants[1]._id,
        name: 'Classic Burger',
        description: 'Beef burger with lettuce, tomato, and cheese',
        price: 9.99,
        image: 'https://via.placeholder.com/150',
      },
      {
        restaurant: createdRestaurants[1]._id,
        name: 'Bacon Burger',
        description: 'Burger with bacon and cheese',
        price: 11.99,
        image: 'https://via.placeholder.com/150',
      },
      // Taco Town
      {
        restaurant: createdRestaurants[2]._id,
        name: 'Chicken Taco',
        description: 'Taco with grilled chicken',
        price: 3.99,
        image: 'https://via.placeholder.com/150',
      },
      {
        restaurant: createdRestaurants[2]._id,
        name: 'Beef Taco',
        description: 'Taco with ground beef',
        price: 4.5,
        image: 'https://via.placeholder.com/150',
      },
    ];
    await Menu.insertMany(menus);

    // Create an order
    const order = new Order({
      user: user._id,
      restaurant: createdRestaurants[0]._id,
      items: [
        { name: 'Margherita Pizza', price: 12.99, quantity: 1 },
        { name: 'Pepperoni Pizza', price: 14.99, quantity: 1 },
      ],
      total: 27.98,
    });
    await order.save();

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();

