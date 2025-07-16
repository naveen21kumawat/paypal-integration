const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_API } = process.env;

const getAccessToken = async () => {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
  const res = await axios.post(
    `${PAYPAL_API}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return res.data.access_token;
};
app.get('/',(req,res)=>{
res.send("hello")
})

app.post("/create-order", async (req, res) => {
  const { amount } = req.body;
  if (!amount) return res.status(400).json({ error: "Amount is required" });

  try {
    const accessToken = await getAccessToken();
    const orderRes = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [{ amount: { currency_code: "USD", value: amount } }],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ id: orderRes.data.id });
  } catch (error) {
    console.error("Error creating PayPal order:", error.message);
    res.status(500).json({ error: "Failed to create PayPal order" });
  }
});

app.post("/capture-order/:orderID", async (req, res) => {
  const { orderID } = req.params;

  try {
    const accessToken = await getAccessToken();
    const captureRes = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(captureRes.data);
  } catch (error) {
    console.error(" Error capturing PayPal order:", error.message);
    res.status(500).json({ error: "Failed to capture PayPal order" });
  }
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
