const mongoose = require("mongoose");
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);

const Order = require("../model/Order");

const getOrders = (req, res) => {
    let orders = Order.find();

    if (req.query.populate) {
        const populates = Array.isArray(req.query.populate)
            ? req.query.populate
            : [req.query.populate];

        for (const field of populates) {
            orders = orders.populate(field);
        }
    }

    orders
        .then((orders) => res.json(orders))
        .catch((err) => res.status(404).send({ message: err.message }));
};

const createOrder = async (req, res, next) => {
    let { paymentDetails, orderDetails } = req.body;

    try {
        const payment = await stripe.paymentIntents.create({
            amount: paymentDetails.amount,
            currency: paymentDetails.currency,
            description: paymentDetails.description,
            payment_method: paymentDetails.payment_method,
            confirm: true,
        });

        Order.create(
            {
                ...orderDetails,
                orderedBy: req.user._id,
                transactionID: payment.id,
            },
            (err, order) => {
                if (err) {
                    return res.status(502).json({ message: err.message });
                } else {
                    if (orderDetails.type === "Subscription") {
                        req.user.subscriptions.push(orderDetails.subscription);

                        req.user.save(function (err) {
                            if (err) {
                                return next(err);
                            }

                            return res.status(201).json({
                                message: "Payment successful",
                                success: true,
                                order: order,
                            });
                        });
                    } else {
                        return res.status(201).json({
                            message: "Payment successful",
                            success: true,
                            order: order,
                        });
                    }
                }
            }
        );
    } catch (error) {
        return res.json({
            message: "Payment failed",
            success: false,
        });
    }
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
