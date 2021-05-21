const express = require("express");
const router = express.Router();

const {
  getProductById,
  createProduct,
  getProduct,
  photo,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getAllUniqueProduct,
} = require("../controllers/product");
const { getUserById } = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

//parms
router.param("userId", getUserById);
router.param("productId", getProductById);

//routes

//create
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

//read
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

//update
router.put("/product/:productId/:userId", updateProduct);

//delete
router.delete("/product/:productId/:userId", deleteProduct);

//listing
router.get("/products", getAllProducts);

router.get("/product/category", getAllUniqueProduct);

module.exports = router;
