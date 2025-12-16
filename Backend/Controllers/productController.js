const Product = require("../Model/Product");

// Add Product
const addProduct = async (req, res) => {
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
};

// Fetch all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
 
    res.status(200).json({
      message: "All products fetched successfully",
      products,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
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
};

// Update product
const updateProduct = async (req, res) => {
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
};

// Get single product
const getProductById = async (req, res) => {
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
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.status(200).json({
      message: "Categories fetched successfully",
      categories,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
  getProductById,
  getCategories,
};
