const router = require("express").Router();
const paymentCont = require("../controllers/payment");
// const paymentMid = require("../middleware/payment");
const authMid = require("../middlewares/auth");

router.post(
  "/create-payment",
  authMid.isAuthenticated,
  paymentCont.createPayment
);

router.post(
  "/verify-payment",
  authMid.isAuthenticated,
  paymentCont.verifyPayment
);

module.exports = router;
