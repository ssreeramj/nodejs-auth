const express = require('express');
const mongoose = require('mongoose');
require('dotenv/config')

// Initializing express app
const app = express();

// Routes
const customerRoutes = require('./routes/customers');
const orderRoutes = require('./routes/posts');

// Middlewares
app.use(express.json());

// Route Middlewares
app.use('/api/v1/customers', customerRoutes);
app.use('/orders', orderRoutes);

// Connect to database
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => { console.log('Connected to Database!'); }
);

// Connect to port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}.....`);
});
