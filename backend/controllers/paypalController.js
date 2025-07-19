const axios = require("axios");
const { getAccessToken } = require("../utils/paypalUtils");
const Transaction = require("../models/Transaction");

exports.saveSubscription = async (req, res) => {
  const { subscriptionID, price } = req.body;

  if (!subscriptionID || !price) {
    return res.status(400).json({ message: "Missing subscriptionID or price" });
  }

  try {
    const accessToken = await getAccessToken();

    const { data: subscriptionDetails } = await axios.get(
      `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionID}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const transactionID = subscriptionDetails.billing_info?.last_payment?.transaction_id || null;

    // Save to MongoDB
    const newTransaction = new Transaction({
      subscriptionID,
      transactionID,
      planID: subscriptionDetails.plan_id,
      status: subscriptionDetails.status,
      payerEmail: subscriptionDetails.subscriber?.email_address || "",
      amount: price,
      currency: subscriptionDetails.billing_info?.last_payment?.amount?.currency_code || "USD",
    });

    await newTransaction.save();

    return res.status(200).json({
      message: "Subscription fetched and saved",
      subscription: {
        ...subscriptionDetails,
        transaction_id: transactionID,
      },
    });
  } catch (error) {
    console.error("❌ Error saving subscription:", error?.response?.data || error);
    return res.status(500).json({ message: "Failed to fetch or save subscription" });
  }
};
