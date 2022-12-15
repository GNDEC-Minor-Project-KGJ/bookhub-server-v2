const User = require("../models/user");
const { verifyAuthToken } = require("../utils/auth");

const auth = {
  isAuthenticated: async (req, res, next) => {
    try {
      console.log(req.headers);
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = await verifyAuthToken(token);
      console.log(token);
      console.log(decodedToken);

      if (decodedToken) {
        req.userId = decodedToken.id;
        const user = await User.findById(req.userId);
        if (user) {
          req.isAdmin = user.role;
          next();
        } else return res.status(404).json({ message: "User not found" });
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    } catch (error) {
      console.log("Middleware: auth: isAuthenticated: error: ", error);
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = auth;
