const mongoose = require('mongoose');

const express = require('express');
const router = express.Router();

const Order = require('../../model/Order');

// Get all orders
router.get('/', (req, res) => {
    let orders = Order.find();

    if (req.query.populate) {
        const populates = (typeof req.query.populate === "string" ? [req.query.populate] : req.query.populate);

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
// TODO: propagate to user
router.post('/', (req, res) => {
    const order = new Order(req.body);
    order._id = new mongoose.Types.ObjectId();

    order.save()
        .then(data => res.sendStatus(201))
        .catch(err => res.status(502).send({ message: err.message }));
});

// Get specific order
router.get('/:order', (req, res) => {
    let order = Order.findOne({ _id: req.params.order });

    if (req.query.populate) {
        const populates = (typeof req.query.populate === "string" ? [req.query.populate] : req.query.populate);

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
router.put('/:order', (req, res) => {
    const order = new Order(req.body);
    Order.findByIdAndUpdate(
        req.params.order, 
        order,
        (err, order) => {
            if (err) {
                res.status(502).send({ message: err.message });
            } else {
                res.sendStatus(200);
            }
        });
});

// Remove specific order
// TODO: propagate to user
router.delete('/:order', (req, res) => {
    Order.findByIdAndDelete(req.params.order, (err, order) => {
        if (err) {
            res.status(404).send({ message: err.message });
        } else {
            res.sendStatus(200);
        }
    });
});

module.exports = router;