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
        const data = await Insta.PaymentData();
        data.setRedirectUrl(`http://localhost:5000/api/payment/verify-payment`);
        // data.send_sms = "True";
        data.send_email = "True";
        data.email = user.email;
        data.purpose = "TEST";
        data.amount = amount;
        data.buyer_name = user.name;
        data.phone = user.phone;

        Insta.createPayment(data, async function (error, response) {
          if (error)
            return res.status(500).json({ message: "Something went wrong" });

          const paymentRequestData = JSON.parse(response);

          const payment = new Payment({
            paymentRequestId: paymentRequestData.payment_request.id,
            name: paymentRequestData.payment_request.buyer_name,
            phone: paymentRequestData.payment_request.phone,
            amount: parseInt(paymentRequestData.payment_request.amount),
            paymentRequestStatus: paymentRequestData.payment_request.status,
            paymentLink: paymentRequestData.payment_request.longurl,
            userId,
          });

          await payment.save();

          return res
            .status(200)
            .json({ paymentLink: paymentRequestData.payment_request.longurl });
        });
      }
    } catch (err) {
      console.log("Controller: payment: createPayment: error: ", err);
      return res.status(500).json({ message: err.message });
    }
  },

  verifyPayment: async (req, res) => {
    try {
      const paymentId = req.query.payment_id;
      const paymentRequestId = req.query.payment_request_id;

      Insta.getPaymentDetails(
        paymentRequestId,
        paymentId,
        async (error, response) => {
          if (error) return res.status(500).json({ message: error.message });

          const paymentDetails = await Payment.findOne({
            paymentRequestId: response.payment_request.id,
          });

          if (paymentDetails) {
            paymentDetails.paymentRequestId = response.payment_request.id;
            paymentDetails.paymentId =
              response.payment_request.payment.payment_id;
            paymentDetails.paymentRequestStatus =
              response.payment_request.status;
            paymentDetails.paymentStatus =
              response.payment_request.payment.status;
            paymentDetails.paymentRequestCreatedAt =
              response.payment_request.created_at;
            paymentDetails.paymentCreatedAt =
              response.payment_request.payment.created_at;
            paymentDetails.currency = response.payment_request.payment.currency;
            const user = await User.findById(paymentDetails.userId);

            if (user) {
              if (user.payments.includes(paymentDetails._id))
                return res
                  .status(200)
                  .json({ message: "Payment already verified" });

              user.credit += paymentDetails.amount;
              user.payments.push(paymentDetails._id);
              await user.save();
              return res.status(200).json({ message: "Payment verified" });
            }

            return res.status(200).json({ message: "User not found" });
          }

          return res.status(200).json({ message: "Payment not found" });
        }
      );
    } catch (err) {
      console.log("Controller: payment: verifyPayment: error: ", err);
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = payment;
