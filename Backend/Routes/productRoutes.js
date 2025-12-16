const express = require("express");
const router = express.Router();
const {
  addProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
  getProductById,
  getCategories,
} = require("../Controllers/productController");

// Add Product Route
router.post("/addproduct", addProduct);

// Fetch all products
router.get("/all-products", getAllProducts);

// Fetch all categories
router.get("/categories", getCategories);

// Delete product
router.delete("/del-product/:id", deleteProduct);

// UPDATE PRODUCT
router.put("/update-product/:id", updateProduct);

// GET SINGLE PRODUCT
router.get("/product/:id", getProductById);

module.exports = router;
