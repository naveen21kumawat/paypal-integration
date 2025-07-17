const axios = require("axios");
const Subscription = require("../models/Subscription");
const User = require("../models/User");

exports.saveSubscription = async (req, res) => {
  const { subscriptionID, name, email } = req.body;

  try {
    // 1. Get subscription details from PayPal
    const response = await axios.get(
      `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionID}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
          ).toString("base64")}`,
          "Content-Type": "application/json",
        },
      }
    );

    const sub = response.data;

    // 2. Find or Create User
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email });
    }

    // 3. Save Subscription
    await Subscription.create({
      userId: user._id,
      paypalSubscriptionId: sub.id,
      status: sub.status,
      startDate: sub.start_time,
      nextBillingDate: sub.billing_info?.next_billing_time,
    });

    res.status(200).json({ success: true, userId: user._id });
  } catch (err) {
    console.error("Error saving subscription:", err.message);
    res.status(500).json({ success: false, message: "Failed to save subscription" });
  }
};
