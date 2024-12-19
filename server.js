const express = require("express");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const otpRoutes = require("./routes/otpRoutes");

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.use(bodyParser.json());

// Rate limiter (Allow 5 requests per IP in 1 minute)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Apply rate limiter to all requests
app.use(limiter);

// Use OTP routes
app.use("/api/otp", otpRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
