const express = require("express");
const Product = require("../Model/Product");

const router = express.Router();

// Add Product Route
router.post("/addproduct", async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Fetch all products
router.get("/all-products", async (req, res) => {
  try {
    const products = await Product.find();
 
    res.status(200).json({
      message: "All products fetched successfully",
      products,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete product
router.delete("/del-product/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE PRODUCT
router.put("/update-product/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true } 
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET SINGLE PRODUCT
router.get("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET UNIQUE CATEGORIES
router.get("/categories", async (req, res) => {
  try {
    const categories = await Product.distinct("category");

    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories", error });
  }
});








module.exports = router;
