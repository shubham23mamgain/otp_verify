const axios = require("axios");
const OTP = require("../models/otp");

// Replace with your MSG91 API key
const msg91ApiKey = "YOUR_MSG91_API_KEY";
const msg91SenderId = "YOUR_SENDER_ID"; // e.g., 'TXTLCL'
const msg91TemplateId = "YOUR_TEMPLATE_ID"; // Replace with your template ID

// Function to generate OTP and send via MSG91
const sendOtp = async (phoneNumber) => {
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

  const msg91Url = `https://api.msg91.com/api/v5/otp?authkey=${msg91ApiKey}&template_id=${msg91TemplateId}&mobile=${phoneNumber}&otp=${otp}`;

  try {
    // Make API call to MSG91 to send OTP
    const response = await axios.get(msg91Url);
    if (response.data.type === "success") {
      console.log(`OTP sent successfully: ${otp}`);
      return otp;
    } else {
      throw new Error("Failed to send OTP");
    }
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    throw error;
  }
};

const storeOtp = async (phoneNumber, otp) => {
  const otpDoc = new OTP({ phoneNumber, otp });
  await otpDoc.save();
};

// Function to verify OTP
const verifyOtp = async (phoneNumber, otp) => {
  const otpDoc = await OTP.findOne({ phoneNumber, otp }).sort({
    createdAt: -1,
  });

  if (!otpDoc) {
    throw new Error("Invalid OTP or OTP expired");
  }

  // Check if OTP has expired (valid for 5 minutes)
  const otpExpiryTime = 5 * 60 * 1000;
  if (new Date() - otpDoc.createdAt > otpExpiryTime) {
    await otpDoc.remove();
    throw new Error("OTP expired");
  }

  // OTP is valid, delete it after successful verification
  await otpDoc.remove();
  return true;
};

module.exports = { sendOtp, storeOtp, verifyOtp };
