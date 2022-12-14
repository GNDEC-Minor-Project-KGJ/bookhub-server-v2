const user = {
  signin: (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        next();
      } else {
        return res
          .status(400)
          .json({ message: "Please provide all the required fields" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  signup: (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      if (name && email && password) {
        next();
      } else {
        return res
          .status(400)
          .json({ message: "Please provide all the required fields" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  isAdmin: (req, res, next) => {
    try {
      if (req.isAdmin) {
        next();
      } else {
        return res.status(403).json({ message: "Access denied" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = user;
