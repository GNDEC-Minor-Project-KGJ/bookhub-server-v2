const User = require("../models/user");
const Payment = require("../models/payment");
const { generateAuthToken } = require("../utils/auth");

const user = {
  signin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      console.log(user.authenticate(password));
      if (user && user.authenticate(password)) {
        const token = await generateAuthToken(user._id);
        return res.status(200).json({ token });
      } else {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.log("Controller: user: signin: error: ", error);
      return res.status(500).json({ message: error.message });
    }
  },

  signup: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const user = new User({ name, email, password });
      const savedUser = await user.save();
      const token = await generateAuthToken(savedUser._id);
      return res.status(201).json({ token });
    } catch (error) {
      console.log("Controller: user: signup: error: ", error);
      return res.status(500).json({ message: error.message });
    }
  },

  getUser: async (req, res) => {
    try {
      const { userId } = req;
      const user = await User.findById(userId);
      if (user) {
        return res.status(200).json({ user });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.log("Controller: user: getUser: error: ", error);
      return res.status(500).json({ message: error.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      console.log(req.body);
      console.log(req.userId);
      const user = await User.findById(req.userId);
      console.log(user);
      if (user) {
        user.name = name;
        user.email = email;
        user.password = password;
        const updatedUser = await user.save();
        console.log(updatedUser);
        return res.status(200).json({ user: updatedUser });
      } else return res.status(404).json({ message: "User not found" });
    } catch (error) {
      console.log("Controller: user: updateUser: error: ", error);
      return res.status(500).json({ message: error.message });
    }
  },

  userPurchaseList: async (req, res) => {
    try {
      const { userId } = req;
      const user = await User.findById(userId);
      const purchasedProducts = [];
      if (user) {
        user.purchases.forEach(async (productId) => {
          try {
            const purchasedProduct = await Product.findById(productId);
            purchasedProducts.push(purchasedProduct);
          } catch (error) {
            console.log(
              "Controller: user: userPurchaseList: loop: error: ",
              error
            );
          }
          purchasedProducts.push(purchasedProduct);
        });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.log("Controller: user: userPurchaseList: error: ", error);
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = user;
