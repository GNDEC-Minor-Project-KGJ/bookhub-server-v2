const Payment = require("../models/payment");
const User = require("../models/user");
const Insta = require("../utils/payment");

const payment = {
  createPayment: async (req, res) => {
    try {
      const userId = req.userId;
      const amount = req.body.amount;
      const user = await User.findById(userId);
      if (user) {
        const data = await Insta.paymentData();
        data.setRedirectUrl(`http://localhost:3000/shop/${bookId}`);
        data.send_sms = "True";
        data.send_email = "True";
        data.email = user.email;
        data.purpose = "TEST";
        data.amount = amount;
        data.buyer_name = user.name;
        data.phone = user.phone;

        const response = await Insta.createPayment(data);
        const paymentRequestData = JSON.parse(response);

        const payment = new Payment({
          paymentRequestId: paymentRequestData.payment_request.id,
          name: paymentRequestData.payment_request.buyer_name,
          phone: paymentRequestData.payment_request.phone,
          amount: parseInt(paymentRequestData.payment_request.amount),
          paymentRequestStatus: paymentRequestData.payment_request.status,
          paymentLink: paymentRequestData.payment_request.longurl,
        });

        await payment.save();

        return res
          .status(200)
          .json({ paymentLink: paymentRequestData.payment_request.longurl });
      }
    } catch (err) {
      console.log("Controller: payment: createPayment: error: ", err);
      return res.status(500).json({ message: err.message });
    }
  },

  verifyPayment: async (req, res) => {
    try {
      return res.status(200).json({ message: "Payment verified" });
    } catch (err) {
      console.log("Controller: payment: verifyPayment: error: ", err);
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = payment;
