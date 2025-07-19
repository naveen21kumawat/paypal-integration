const express = require("express");
const router = express.Router();
const { saveSubscription } = require("../controllers/paypalController");

router.post("/save-subscription", saveSubscription);

module.exports = router;
