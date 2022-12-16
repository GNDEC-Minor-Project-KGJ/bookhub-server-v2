const paymentCont = require("../controllers/payment");
const User = require("../models/user");

jest.mock("../models/user");

const req = {
  userId: process.env.TESTING_USER_ID,
  body: {
    amount: 100,
  },
};

const res = {
  status: jest.fn((x) => res),
  json: jest.fn((x) => res),
};

it("Should send payment link", async () => {
  User.findById.mockImplementationOnce(() => ({
    id: process.env.TESTING_USER_ID,
  }));
  await paymentCont.createPayment(req, res);
  expect(response.status).toHaveBeenCalledWith(200);
});
