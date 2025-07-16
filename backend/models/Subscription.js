const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  paypalSubscriptionId: String,
  status: String,
  startDate: Date,
  nextBillingDate: Date,
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
