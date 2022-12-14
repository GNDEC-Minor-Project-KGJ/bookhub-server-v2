const router = require("express").Router();
const productCont = require("../controllers/product");
const productMid = require("../middlewares/product");
const authMid = require("../middlewares/auth");
const userMid = require("../middlewares/user");

// Developer only
router.get("/seed", productCont.seedProducts);

// Public endpoints
router.get("/", authMid.isAuthenticated, productCont.getAllProducts);

router.post(
  "/",
  authMid.isAuthenticated,
  userMid.isAdmin,
  productMid.validateProduct,
  productCont.createProduct
);

router.get(
  "/category/:genre",
  authMid.isAuthenticated,
  productCont.getProductsByGenre
);

router.get(
  "/search/:search",
  authMid.isAuthenticated,
  productCont.searchProducts
);

router.get(
  "/top-rated",
  authMid.isAuthenticated,
  productCont.getTopRatedProducts
);

router.get(
  "/featured",
  authMid.isAuthenticated,
  productCont.getFeaturedProducts
);

router.get(
  "/recommended/:id",
  authMid.isAuthenticated,
  productCont.getRecommendedProducts
);

router.get("/:id", authMid.isAuthenticated, productCont.getProductById);

router.put(
  "/:id",
  authMid.isAuthenticated,
  userMid.isAdmin,
  productCont.updateProduct
);

router.delete(
  "/:id",
  authMid.isAuthenticated,
  userMid.isAdmin,
  productCont.deleteProduct
);


module.exports = router;
