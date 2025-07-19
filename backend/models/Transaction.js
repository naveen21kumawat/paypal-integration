const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  subscriptionID: { type: String, required: true },
  transactionID: { type: String },
  planID: { type: String },
  status: { type: String },
  payerEmail: { type: String },
  amount: { type: String },
  currency: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", transactionSchema);
