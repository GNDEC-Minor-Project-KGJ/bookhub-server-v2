const router = require("express").Router();
const productCont = require("../controllers/product");
const productMid = require("../middlewares/product");
const authMid = require("../middlewares/auth");
const userMid = require("../middlewares/user");

// Developer only endpoint. This api is used to seed the database with books that are available in the book ML server
router.get("/seed", productCont.seedProducts);

// Get all products from the database based on the user past preferences
router.get("/", authMid.isAuthenticated, productCont.getAllProducts);

// Create a new product in the database
router.post(
  "/",
  authMid.isAuthenticated,
  userMid.isAdmin,
  productMid.validateProduct,
  productCont.createProduct
);

// Get all products from the database that are of a particular genre
router.get(
  "/genre/:genre",
  authMid.isAuthenticated,
  productCont.getProductsByGenre
);

// Get the searched products from the database
router.get(
  "/search/:search",
  authMid.isAuthenticated,
  productCont.searchProducts
);

// Get the top rated products from the database
router.get(
  "/top-rated",
  authMid.isAuthenticated,
  productCont.getTopRatedProducts
);

// Get the featured products from the database
router.get(
  "/featured",
  authMid.isAuthenticated,
  productCont.getFeaturedProducts
);

// Get the recommended products from the database based on a provided book ID
router.get(
  "/recommended/:id",
  authMid.isAuthenticated,
  productCont.getRecommendedProducts
);

// Get a product from the database based on it's ID
router.get("/:id", authMid.isAuthenticated, productCont.getProductById);

// Update a product in the database based on it's ID
router.put(
  "/:id",
  authMid.isAuthenticated,
  userMid.isAdmin,
  productCont.updateProduct
);

// Delete a product from the database based on it's ID
router.delete(
  "/:id",
  authMid.isAuthenticated,
  userMid.isAdmin,
  productCont.deleteProduct
);


module.exports = router;
