const { getAccessToken, createOrder, captureOrder } = require("../services/paypalService");

exports.createOrderHandler = async (req, res) => {
  const { amount } = req.body;
  if (!amount) return res.status(400).json({ error: "Amount is required" });

  try {
    const orderID = await createOrder(amount);
    res.json({ id: orderID });
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({ error: "Failed to create PayPal order" });
  }
};

exports.captureOrderHandler = async (req, res) => {
  const { orderID } = req.params;

  try {
    const result = await captureOrder(orderID);
    res.json(result);
  } catch (error) {
    console.error("Error capturing order:", error.message);
    res.status(500).json({ error: "Failed to capture PayPal order" });
  }
};
