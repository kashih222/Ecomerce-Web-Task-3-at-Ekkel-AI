// routes/orderRoutes.js
const express = require("express");
const Order = require("../Model/Order");
const authMiddleware = require("../Middlewares/authMiddleware"); 
const router = express.Router();
const User = require("../Model/User");

// Place an order

router.post("/place-order", authMiddleware, async (req, res) => {
  try {
    const { items, shippingDetails, totalPrice,  } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    const calculatedTotal = totalPrice || items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newOrder = new Order({
      userId: req.user.id,
      items,
      totalPrice: calculatedTotal,
      shippingDetails,
    });

    await newOrder.save();

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// GET /api/order/all-orders
router.get("/all-orders", async (req, res) => {
  try {
    const orders = await Order.find().lean();

    // Fetch user info for each order
    const ordersWithUser = await Promise.all(
      orders.map(async (order) => {
        const user = await User.findById(order.userId).lean();
        return {
          ...order,
          user: user ? { fullName: user.fullname, email: user.email } : null,
        };
      })
    );

    res.json({ orders: ordersWithUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single order
router.get("/order/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching order" });
  }
});

// Update order status (Admin)
router.put("/update-status/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order status updated", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while updating order" });
  }
});

// Delete an order (Admin)
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while deleting order" });
  }
});

module.exports = router;
