const express = require("express");
const router = express.Router();
const {
  createOrderHandler,
  captureOrderHandler,
} = require("../controllers/paypalController");

router.post("/create-order", createOrderHandler);
router.post("/capture-order/:orderID", captureOrderHandler);

module.exports = router;
