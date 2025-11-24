const express = require("express");
const Cart = require("../Model/Cart");
const authMiddleware = require("../Middlewares/authMiddleware");
const router = express.Router();

// Helper to format cart items
const formatCartItems = (cart) => {
  return cart.cartItems
    .filter((item) => item.productId) 
    .map((item) => ({
      _id: item._id,
      quantity: item.quantity,
      productId: item.productId._id,
      name: item.productId.name || item.name, 
      price: item.productId.price || item.price,
      images: { thumbnail: item.productId.images?.thumbnail || item.images?.thumbnail || "/placeholder.png" },
    }));
};

// Get Cart
router.get("/get-cart", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate("cartItems.productId");

    if (!cart) return res.json({ cartItems: [] });

    res.json({ cartItems: formatCartItems(cart) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add to Cart
router.post("/add-to-cart", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId }).populate("cartItems.productId");
    if (!cart) cart = new Cart({ userId, cartItems: [] });

    const itemIndex = cart.cartItems.findIndex(
      (item) => item.productId && item.productId._id.toString() === productId
    );

    if (itemIndex > -1) {
      cart.cartItems[itemIndex].quantity += quantity;
    } else {
      cart.cartItems.push({ productId, quantity });
    }

    await cart.save();
    cart = await cart.populate("cartItems.productId");

    res.json({ message: "Item added to cart", cartItems: formatCartItems(cart) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update Quantity
router.post("/update-qty", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId }).populate("cartItems.productId");
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.cartItems.find((i) => i.productId && i.productId._id.toString() === productId);
    if (!item) return res.status(404).json({ message: "Product not in cart" });

    item.quantity = quantity;
    await cart.save();

    res.json({ message: "Quantity updated", cartItems: formatCartItems(cart) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove Item
router.post("/remove-item", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { cartItems: { productId } } },
      { new: true }
    ).populate("cartItems.productId");

    if (!cart) return res.json({ cartItems: [] });

    res.json({ message: "Item removed", cartItems: formatCartItems(cart) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
