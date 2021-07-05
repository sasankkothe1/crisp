const express = require("express");
const router = express.Router();

const { isAuthenticated, isAdmin } = require("../../middleware/auth");

const OrderController = require("../../controllers/order");

// Get all orders
// Auth: Admin
router.get("/", isAuthenticated, isAdmin, OrderController.getOrders);

// Add new order
// Auth: User
router.post("/", isAuthenticated, OrderController.createOrder);

// Get specific order
// Auth: User
router.get("/:id", isAuthenticated, OrderController.getOrder);

// Edit specific order
// Auth: User
router.put("/:id", isAuthenticated, OrderController.editOrder);

// Remove specific order
// Auth: Admin
router.delete("/:id", isAuthenticated, isAdmin, OrderController.removeOrder);

module.exports = router;
