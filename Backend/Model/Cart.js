const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: String,
  price: Number,
  quantity: { type: Number, default: 1 },
  images: {
    thumbnail: String,
  },
});

const CartSchema = new mongoose.Schema(
  {
    // Logged-in user cart
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    // Guest user cart
    cartId: {
      type: String,
      default: null,
      index: true,
    },

    cartItems: [CartItemSchema],
  },
  { timestamps: true }
);


CartSchema.index(
  { userId: 1 },
  { unique: true, partialFilterExpression: { userId: { $type: "objectId" } } }
);

CartSchema.index(
  { cartId: 1 },
  { unique: true, partialFilterExpression: { cartId: { $type: "string" } } }
);

module.exports = mongoose.model("Cart", CartSchema);
