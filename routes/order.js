const express = require("express");
const router = express.Router();

const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const {
  getOrderById,
  createOrder,
  getAllOrders,
  getOrderStatus,
  updateStatus,
  getOrder
} = require("../controllers/order");
const { updateStock } = require("../controllers/product");

//params
router.param("userId", getUserById);
router.param("orderId", getOrderById);

//routes

//create
router.post(
  "/order/create/:userId",
  isSignedIn,
  isAuthenticated,
  pushOrderInPurchaseList,
  updateStock,
  createOrder
);

//read
router.get(
  "/orders",
  getAllOrders
);

router.get("/order/:orderId", getOrder);

router.get("/order/status/:userId",isSignedIn,isAuthenticated,getOrderStatus);

router.put("/order/:orderId/status/:userId",isSignedIn,isAuthenticated,isAdmin,updateStatus)

module.exports = router;
