const router = require("express").Router();
const userCont = require("../controllers/user");
const userMid = require("../middlewares/user");
const authMid = require("../middlewares/auth");

router.get("/", authMid.isAuthenticated, userCont.getUser);

router.put("/", authMid.isAuthenticated, userMid.isAdmin, userCont.updateUser);

router.post("/signup", userMid.signup, userCont.signup);

router.post("/signin", userMid.signin, userCont.signin);

router.post(
  "/payment-record",
  authMid.isAuthenticated,
  userCont.userPurchaseList
);

module.exports = router;
