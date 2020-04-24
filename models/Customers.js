const mongoose = require('mongoose');

const CustomerSchema = mongoose.Schema({
    name: String,
    mobile: String,
    email: String,
    password: String,
});


module.exports = mongoose.model('Customers', CustomerSchema);