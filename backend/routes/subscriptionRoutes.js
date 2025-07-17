const express = require("express");
const router = express.Router();
const { saveSubscription } = require("../controllers/subscriptionController");

router.post("/save-subscription", saveSubscription);

module.exports = router;
