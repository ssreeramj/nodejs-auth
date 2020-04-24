const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const Customer = require('../models/Customers')
const { customerRegisterValidation } = require('../validation/customer_registration');
const { customerLoginValidation } = require('../validation/customer_login');

router.get('/', (req, res) => {
    Customer.find()
        .then((data) => res.json(data))
        .catch((err) => res.status(400).json(err));
});

router.get('/:id', (req, res) => {
    Customer.findById(req.params.id)
        .then((data) => res.json({id: data._id, name: data.name, mobile: data.mobile}))
        .catch((err) => res.status(400).json(err));
});

router.post('/', async (req, res) => {
    // Validate the body
    const { error } = customerRegisterValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if email already exists
    const emailCheck = await Customer.findOne({email: req.body.email});
    if (emailCheck) return res.status(400).send('Email already exists...');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    // Instance of Customer model
    const NewCustomer = Customer({
        name: req.body.name,
        mobile: req.body.mobile,
        email: req.body.email,
        password: hashedPassword,
    });

    // Save the instance to database and return response
    NewCustomer.save()
        .then((data) => res.json({id: data._id, name: data.name}))
        .catch((err) => res.status(400).send(err));
});

router.put('/:id', (req, res) => {
    const { error } = customerRegisterValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    Customer.findByIdAndUpdate({ _id: req.params.id },
        {
            $set: {
                name: req.body.name, mobile: req.body.mobile,
                email: req.body.email, password: req.body.password
            }
        }, { useFindAndModify: false, new: true }
    )
        .then((docs) => {
            if (docs) {
                res.json({ success: true, data: docs });
            } else {
                res.status(404).json({ success: false, data: "no such user exist" });
            }
        })
        .catch((err) => res.status(400).json(err));
});

router.delete('/:id', (req, res) => {
    Customer.findOneAndRemove({ _id: req.params.id }, { useFindAndModify: false })
        .then((docs) => {
            if (docs) {
                res.json({ "success": true, data: docs });
            } else {
                res.status(404).json({ "success": false, data: "no such user exist" });
            }
        })
        .catch((err) => res.status(400).json(err));
});

router.post('/login', async (req, res) => {
    // Validate the body
    const { error } = customerLoginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    // Check if email already exists
    const user = await Customer.findOne({email: req.body.email});
    if (!user) return res.status(401).send('Email not found..');

    // Compare password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(401).send('Incorrect Passoword..');

    //Assign web token
    const webToken = jwt.sign({id: user._id}, process.env.SECRET_KEY);
    res.header('Authorization', webToken).send('Successfully logged in!!')
});


module.exports = router;    