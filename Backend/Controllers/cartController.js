const Cart = require("../Model/Cart");

//HELPER 
const formatCartItems = (cart) =>
  cart.cartItems
    .filter((item) => item.productId)
    .map((item) => ({
      _id: item._id,
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      quantity: item.quantity,
      image: item.productId.images?.thumbnail || "/placeholder.png",
    }));

// GET CART
const getCart = async (req, res) => {
  try {
    const { cartId } = req.query;
    const userId = req.user?.id || null;

    const cart = await Cart.findOne({
      $or: [{ userId }, { cartId }],
    }).populate("cartItems.productId");

    if (!cart) return res.json({ cartItems: [] });

    res.json({ cartItems: formatCartItems(cart) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//ADD TO CART
const addToCart = async (req, res) => {
  try {
    const { productId, quantity, cartId } = req.body;
    const userId = req.user?.id || null;

    let cart = await Cart.findOne({
      $or: [{ userId }, { cartId }],
    });

    if (!cart) {
      cart = new Cart({ userId, cartId, cartItems: [] });
    }

    const itemIndex = cart.cartItems.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.cartItems[itemIndex].quantity += quantity;
    } else {
      cart.cartItems.push({ productId, quantity });
    }

    await cart.save();
    await cart.populate("cartItems.productId");

    res.json({
      message: "Item added to cart",
      cartItems: formatCartItems(cart),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//UPDATE QUANTITY 
const updateQty = async (req, res) => {
  try {
    const { productId, quantity, cartId } = req.body;
    const userId = req.user?.id || null;

    const cart = await Cart.findOne({
      $or: [{ userId }, { cartId }],
    }).populate("cartItems.productId");

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.cartItems.find(
      (i) => i.productId._id.toString() === productId
    );

    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;
    await cart.save();

    res.json({ cartItems: formatCartItems(cart) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// REMOVE ITEM
const removeItem = async (req, res) => {
  try {
    const { productId, cartId } = req.body;
    const userId = req.user?.id || null;

    const cart = await Cart.findOne({
      $or: [{ userId }, { cartId }],
    }).populate("cartItems.productId");

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.cartItems = cart.cartItems.filter(
      (item) => item.productId && item.productId._id.toString() !== productId
    );

    await cart.save();

    res.json({ cartItems: formatCartItems(cart) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateQty,
  removeItem,
};
