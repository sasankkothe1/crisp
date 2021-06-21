const mongoose = require("mongoose");

const express = require("express");
const router = express.Router();

const Order = require("../../model/Order");

const { isAuthenticated, isAdmin } = require("../../middleware/auth");

// Get all orders
// Auth: Admin
router.get("/", isAuthenticated, isAdmin, (req, res) => {
    let orders = Order.find();

    if (req.query.populate) {
        const populates = Array.isArray(req.query.populate)
            ? req.query.populate
            : [req.query.populate];

        for (const field of populates) {
            console.log(field);
            orders = orders.populate(field);
        }
    }

    orders
        .then((orders) => res.json(orders))
        .catch((err) => res.status(404).send({ message: err.message }));
});

// Add new order
// Auth: User
router.post("/", isAuthenticated, (req, res) => {
    Order.create(
        {
            ...req.body,
            _id: new mongoose.Types.ObjectId(),
            orderedBy: req.user._id,
        },
        (err, order) => {
            if (err) {
                res.status(502).send({ message: err.message });
            } else {
                res.status(201).send({ id: order._id });
            }
        }
    );
});

// Get specific order
// Auth: User
router.get("/:id", isAuthenticated, (req, res) => {
    let order = Order.findOne({ _id: req.params.id, orderedBy: req.user._id });

    if (req.query.populate) {
        const populates = Array.isArray(req.query.populate)
            ? req.query.populate
            : [req.query.populate];

        for (const field of populates) {
            order = order.populate(field);
        }
    }

    order
        .then((order) => res.json(order))
        .catch((err) => res.status(404).send({ message: err.message }));
});

// Edit specific order
// Auth: User
router.put("/:id", isAuthenticated, (req, res) => {
    Order.findOneAndUpdate(
        {
            _id: req.params.id,
            orderedBy: req.user._id,
        },
        req.body,
        (err, order) => {
            if (err) {
                res.status(404).send({ message: err.message });
            } else {
                res.send({ id: order._id });
            }
        }
    );
});

// Remove specific order
// Auth: Admin
router.delete("/:id", isAuthenticated, isAdmin, (req, res) => {
    Order.findOneAndDelete(
        {
            _id: req.params.id,
        },
        (err, order) => {
            if (err) {
                res.status(404).send({ message: err.message });
            } else {
                res.send({ id: order._id });
            }
        }
    );
});

module.exports = router;
