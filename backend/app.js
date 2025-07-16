const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const subscriptionRoutes = require("./routes/subscriptionRoutes");

const app = express();
app.use(cors());
app.use(express.json());
connectDB();
const paypalRoutes = require("./routes/paypalRoutes");

app.get("/", (req, res) => {
  res.send("Hello from PayPal backend");
});

app.use("/api", subscriptionRoutes);

app.use("/api/paypal", paypalRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
