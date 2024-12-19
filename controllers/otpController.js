const otpService = require("../services/otpService");

// API endpoint to send OTP
const sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber || phoneNumber.length !== 10) {
    return res.status(400).json({ error: "Invalid phone number" });
  }

  try {
    const otp = await otpService.sendOtp(phoneNumber);

    // Store OTP in MongoDB for later verification
    await otpService.storeOtp(phoneNumber, otp);

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Failed to send OTP" });
  }
};

const verifyOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp || otp.length !== 6) {
    return res.status(400).json({ error: "Invalid phone number or OTP" });
  }

  try {
    await otpService.verifyOtp(phoneNumber, otp);
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Failed to verify OTP" });
  }
};

module.exports = { sendOtp, verifyOtp };
