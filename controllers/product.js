const User = require("../models/user");
const Product = require("../models/product");
const { getRandomProduct } = require("../utils/product");
const axios = require("axios");
const Insta = require("../utils/payment");

const product = {
  getAllProducts: async (req, res) => {
    try {
      const userId = req.userId;
      const user = await User.findById(userId);
      const randomBookId = getRandomProduct(user.interest);
      console.log(randomBookId);
      const randomProduct = await Product.findOne({
        bookId: randomBookId.toString(),
      });

      // console.log("randomProduct: ", randomProduct);

      const pdata = await Product.findOne({ bookId: randomProduct.bookId });
      const data = await axios.get(
        "http://localhost:8000/api/recommend-book-desc/" +
          pdata.genre +
          "/" +
          pdata.title
      );
      const product = data.data;
      return res.status(200).json({ product });
    } catch (error) {
      console.log("Controller: product: getAllProducts: error: ", error);
      return res.status(500).json({ message: error.message });
    }
  },

  getProductById: async (req, res) => {
    try {
      const userId = req.userId;
      const bookId = req.params.id;
      const user = await User.findById(userId);
      const product = await Product.findOne({ bookId: bookId });
      if (product) {
        user.interest.push(bookId);
        await user.save();
        return res.status(200).json({ product });
      }
      return res.status(404).json({ message: "Product not found" });
    } catch (error) {
      console.log("Controller: product: getProductById: error: ", error);
      return res.status(500).json({ message: error.message });
    }
  },

  getProductsByGenre: async (req, res) => {
    try {
      const { genre } = req.params;
      const products = await Product.find({ genre }).limit(10);
      if (products.length > 0) {
        return res.status(200).json({ products });
      }
      return res.status(404).json({ message: "Products not found" });
    } catch (error) {
      console.log("Controller: product: getProductsByCategory: error: ", error);
      return res.status(500).json({ message: error.message });
    }
  },

  searchProducts: async (req, res) => {
    try {
      const { search } = req.params;
      const products = await Product.aggregate().search({
        text: {
          query: search,
          path: ["title", "author", "genre"],
        },
      });
      if (products.length > 0) {
        return res.status(200).json({ products });
      }
      return res.status(404).json({ message: "Products not found" });
    } catch (error) {
      console.log("Controller: product: searchProducts: error: ", error);
      return res.status(500).json({ message: error.message });
    }
  },

  getTopRatedProducts: async (req, res) => {
    try {
      const products = await Product.find().sort({ rating: -1 }).limit(4);
      if (products.length > 0) {
        return res.status(200).json({ products });
      }
      return res.status(404).json({ message: "Products not found" });
    } catch (error) {
      console.log("Controller: product: getTopRatedProducts: error: ", error);
      return res.status(500).json({ message: error.message });
    }
  },

  getFeaturedProducts: async (req, res) => {
    try {
      const products = await Product.find().sort({ word_count: -1 }).limit(4);
      if (products.length > 0) {
        return res.status(200).json({ products });
      }
      return res.status(404).json({ message: "Products not found" });
    } catch (error) {
      console.log("Controller: product: getFeaturedProducts: error: ", error);
      return res.status(500).json({ message: error.message });
    }
  },

  getRecommendedProducts: async (req, res) => {
    try {
      const bookId = req.params.id;
      const product = await Product.findOne({ bookId });
      const recommendedProducts = await axios.get(
        "http://localhost:8000/api/recommend-book-desc/" +
          product.genre +
          "/" +
          product.title
      );
      if (recommendedProducts.data.length > 0) {
        return res
          .status(200)
          .json({ recommendedProducts: recommendedProducts.data });
      }
      return res.status(404).json({ message: "Products not found" });
    } catch (error) {
      console.log(
        "Controller: product: getRecommendedProducts: error: ",
        error
      );
      return res.status(500).json({ message: error.message });
    }
  },

  createProduct: async (req, res) => {
    try {
      const newProduct = await axios.post(
        "http://127.0.0.1:8000/api/book-create",
        {
          title: req.body.title,
          desc: req.body.description,
          rating: req.body.rating,
          author: req.body.author,
          genre: req.body.genre,
        }
      );

      const product = await axios.get(
        "http://localhost:8000/api/book-detail/" + newProduct.data.id
      );

      const {
        id: bookId,
        title,
        author,
        genre,
        desc: description,
        rating,
        word_count,
      } = newProduct.data;
      const data = new Product({
        title,
        bookId,
        author,
        genre,
        description,
        rating,
        word_count,
      });
      const savedProduct = await data.save();
      return res.status(201).json({ savedProduct });
    } catch (error) {
      console.log("Controller: product: createProduct: error: ", error);
      return res.status(500).json({ message: error.message });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const {
        productId,
        title,
        author,
        genre,
        description,
        rating,
        word_count,
      } = req.body;
      const product = await Product.findById(productId);
      if (product) {
        product.title = title;
        product.author = author;
        product.genre = genre;
        product.description = description;
        product.rating = rating;
        product.word_count = word_count;
        const updatedProduct = await product.save();
        return res.status(200).json({ product: updatedProduct });
      }
      return res.status(404).json({ message: "Product not found" });
    } catch (error) {
      console.log("Controller: product: updateProduct: error: ", error);
      return res.status(500).json({ message: error.message });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const { productId } = req.body;
      const product = await Product.deleteById(productId);
      if (product) {
        return res.status(200).json({ product });
      }
      return res.status(404).json({ message: "Product not found" });
    } catch (error) {
      console.log("Controller: product: deleteProduct: error: ", error);
      return res.status(500).json({ message: error.message });
    }
  },

  seedProducts: async (req, res) => {
    try {
      const books = await axios.get("http://localhost:8000/api/book-list");
      const products = books.data.forEach(async (book) => {
        const product = new Product({
          title: book.title,
          description: book.desc,
          rating: book.rating,
          word_count: book.word_count,
          price: 100,
          genre: book.genre,
          author: book.author,
          bookId: book.id,
          image: book.url,
        });
        await product.save();
      });
      return res.status(201).json({ message: "Seeded successfully" });
    } catch (error) {
      console.log("Controller: product: seedProducts: error: ", error);
      return res.status(500).json({ message: error.message });
    }
  },

  purchaseProduct: async (req, res) => {
    try {
      const bookId = req.params.id;
      console.log("bookId: ", bookId);
      const user = await User.findById(req.userId);
      const product = await Product.findOne({ bookId });

      console.log("user: ", user);

      if (user.purchases.includes(product._id))
        return res
          .status(400)
          .json({ message: "User already purchased this book" });

      console.log("PRICE - ", product.price);

      if (product && product.price <= user.credit) {
        user.credit -= product.price;
        user.purchases.push(product.bookId);
        await user.save();
        return res.status(200).json({ product });
      }

      if (product && product.price > user.credit)
        return res.status(400).json({ message: "Insufficient credit" });

      return res.status(404).json({ message: "Product not found" });
    } catch (error) {
      console.log("Controller: product: purchaseProduct: error: ", error);
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = product;
