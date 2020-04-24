const express = require('express');

const router = express.Router();

// Models
const Customer = require('../models/Customers');

// Middleware
const auth = require('../middlewares/auth');


router.get('/', auth, (req, res) => {
    Customer.findById(req.user.id)
        .then((data) => res.json({id: data._id, name: data.name, mobile: data.mobile}))
        .catch((err) => res.status(400).json(err)); 
}); 

module.exports = router;