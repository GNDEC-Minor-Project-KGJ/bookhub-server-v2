const router = require("express").Router();
const productRoutes = require("./product");
const userRoutes = require("./user");
const paymentRoutes = require("./payment");

router.use("/product", productRoutes);
router.use("/user", userRoutes);
router.use("/payment", paymentRoutes);

module.exports = router;
