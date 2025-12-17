const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    

    description: {
      type: String,
      required: true,
    },

    shortDescription: {
      type: String,
      required: true,
    },

    images: {
      thumbnail: {
        type: String,
        required: true,
      },
      gallery: [String],
      detailImage: {
        type: String,
      },
    },

    specifications: {
      material: String,
      height: String,
      width: String,
      weight: String,
      color: String,
    },

    availability: {
      type: String,
      default: "In Stock",
    },

    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
