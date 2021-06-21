const mongoose = require("mongoose");

const Order = require("../model/Order");

const getOrders = (req, res) => {
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
};

const createOrder = (req, res) => {
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
};

const getOrder = (req, res) => {
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
};

const editOrder = (req, res) => {
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
};

const removeOrder = (req, res) => {
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
};

module.exports = {
    getOrders,
    createOrder,
    getOrder,
    editOrder,
    removeOrder,
};
