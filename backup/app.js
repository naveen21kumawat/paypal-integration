require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Load PayPal credentials from .env
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_CLIENT_SECRET;

// Get PayPal access token
async function getAccessToken() {
  const response = await axios({
    url: "https://api-m.sandbox.paypal.com/v1/oauth2/token",
    method: "post",
    headers: {
      Accept: "application/json",
      "Accept-Language": "en_US",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    auth: {
      username: PAYPAL_CLIENT_ID,
      password: PAYPAL_SECRET,
    },
    data: "grant_type=client_credentials",
  });

  return response.data.access_token;
}

// POST route to save and return subscription details
app.post("/api/save-subscription", async (req, res) => {
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

    console.log("✅ Subscription Details Fetched:");
    console.log(subscriptionDetails);

    // Optionally: Save to DB here

    return res.status(200).json({
      message: "Subscription fetched successfully",
      subscription: subscriptionDetails,
    });
  } catch (error) {
    console.error("❌ Error fetching subscription:", error?.response?.data || error.message);
    return res.status(500).json({ message: "Failed to fetch subscription details" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
