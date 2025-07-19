const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const connectDB = require("./config/db");
const paypalRoutes = require("./routes/paypalRoutes");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// DB Connection
connectDB();

// Routes
app.use("/api", paypalRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
