const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const paypalRoutes = require("./routes/paypalRoutes");

app.get("/", (req, res) => {
  res.send("Hello from PayPal backend");
});

app.use("/api/paypal", paypalRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
