const express = require("express");
const router = express.Router();
const { getCart, addToCart, updateQty, removeItem } = require("../Controllers/cartController");

// GET CART
router.get("/get-cart", getCart);

//ADD TO CART
router.post("/add-to-cart", addToCart);

//UPDATE QUANTITY 
router.post("/update-qty", updateQty);

// REMOVE ITEM
router.post("/remove-item", removeItem);

module.exports = router;
