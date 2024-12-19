const express = require("express");
const router = express.Router();
const otpController = require("../controllers/otpController");

// API route for sending OTP
router.post("/send-otp", otpController.sendOtp);

// API route for verifying OTP
router.post("/verify-otp", otpController.verifyOtp);

module.exports = router;
