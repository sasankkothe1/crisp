const mongoose = require('mongoose');

const express = require('express');
const router = express.Router();

const Order = require('../../model/Order');

const { protect, admin } = require('../../middleware/auth');

// Get all orders
// Auth: Admin
router.get('/', protect, admin, (req, res) => {
    let orders = Order.find();

    if (req.query.populate) {
        const populates = (Array.isArray(req.query.populate) ? req.query.populate : [req.query.populate]);

        for (field of populates) {
            console.log(field);
            orders = orders.populate(field);
        }
    }

    orders
        .then(orders => res.json(orders))
        .catch(err => res.status(404).send({ message: err.message }));
});

// Add new order
// Auth: User
router.post('/', protect, (req, res) => {
    const order = new Order(Object.assign(req.body, { 
        _id: new mongoose.Types.ObjectId(), 
        orderedBy: req.user._id 
    }));

    order.save()
        .then(data => res.status(201).send({ id: order._id }))
        .catch(err => res.status(502).send({ message: err.message }));
});

// Get specific order
// Auth: User
router.get('/:id', protect, (req, res) => {
    let order = Order.findOne({ _id: req.params.id, orderedBy: req.user._id });

    if (req.query.populate) {
        const populates = (Array.isArray(req.query.populate) ? req.query.populate : [req.query.populate]);

        for (field of populates) {
            console.log(field);
            orders = orders.populate(field);
        }
    }

    order
        .then(order => res.json(order))
        .catch(err => res.status(404).send({ message : err.message }));
});

// Edit specific order
// Auth: User
router.put('/:id', protect, (req, res) => {
    Order.findOneAndUpdate({
        _id: req.params.id, 
        orderedBy: req.user._id
    }, req.body, (err, order) => {
        if (err) {
            res.status(404).send({ message: err.message });
        } else {
            res.send({ id: order._id });
        }
    });
});

// Remove specific order
// Auth: Admin
router.delete('/:id', protect, admin, (req, res) => {
    Order.findOneAndDelete({
        _id: req.params.id,
    }, (err, order) => {
        if (err) {
            res.status(404).send({ message: err.message });
        } else {
            res.send({ id: order._id });
        }
    });
});

module.exports = router;