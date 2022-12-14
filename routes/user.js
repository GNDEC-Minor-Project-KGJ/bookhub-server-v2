const router = require("express").Router();
const userCont = require("../controllers/user");
const userMid = require("../middlewares/user");
const authMid = require("../middlewares/auth");

// Get the user details from the database
router.get("/", authMid.isAuthenticated, userCont.getUser);

// Update the user details in the database
router.put("/", authMid.isAuthenticated, userMid.isAdmin, userCont.updateUser);

// Signup a new user in the database
router.post("/signup", userMid.signup, userCont.signup);

// Sign in a user in the database
router.post("/signin", userMid.signin, userCont.signin);

// Get the user purchase history from the database
router.post(
  "/payment-record",
  authMid.isAuthenticated,
  userCont.userPurchaseList
);

module.exports = router;
