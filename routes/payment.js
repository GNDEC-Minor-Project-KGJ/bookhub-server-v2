const router = require("express").Router();
const paymentCont = require("../controllers/payment");
// const paymentMid = require("../middleware/payment");
const authMid = require("../middlewares/auth");

// To initiate a payment request and get the payment link. Then redirecting to the payment link and storing the payment status in the database.
router.post(
  "/create-payment",
  authMid.isAuthenticated,
  paymentCont.createPayment
);

// To verify the payment status and update the payment status in the database. Only if the payment microservice has failed to verify during the intiation of the payment.
router.get("/verify-payment", paymentCont.verifyPayment);

module.exports = router;
