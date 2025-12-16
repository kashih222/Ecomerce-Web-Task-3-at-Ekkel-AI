// routes/orderRoutes.js
const express = require("express");
const authMiddleware = require("../Middlewares/authMiddleware"); 
const guestAuthMiddleware = require("../Middlewares/guestAuthMiddleware");
const router = express.Router();
const {
  placeOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require("../Controllers/orderController");

// Place an order
router.post("/place-order", guestAuthMiddleware, placeOrder);

// GET /api/order/all-orders
router.get("/all-orders", getAllOrders);

// Get single order
router.get("/order/:id", authMiddleware, getOrderById);

// Update order status (Admin)
router.put("/update-status/:id", authMiddleware, updateOrderStatus);

// Delete an order (Admin)
router.delete("/delete/:id", authMiddleware, deleteOrder);

module.exports = router;
