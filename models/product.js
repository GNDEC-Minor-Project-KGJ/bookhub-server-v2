const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      defailt: 100,
      trim: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default:
        "https://www.iconspng.com/images/book-generic-standing/book-generic-standing.jpg",
    },
    author: {
      type: String,
      default: "Anonymous",
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      trim: true,
    },
    bookId: {
      type: String,
      required: true,
      trim: true,
    },
    word_count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
