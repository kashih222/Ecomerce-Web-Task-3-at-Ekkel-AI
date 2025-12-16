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

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
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

    reviews: [
      {
        user: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          min: 0,
          max: 5,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
