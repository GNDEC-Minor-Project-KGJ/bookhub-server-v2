const jwt = require("jsonwebtoken");

module.exports.verifyAuthToken = async (token) => {
  try {
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    return decodedToken;
  } catch (error) {
    return false;
  }
};

module.exports.generateAuthToken = async (id) => {
  try {
    const token = await jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    return token;
  } catch (error) {
    return false;
  }
};
