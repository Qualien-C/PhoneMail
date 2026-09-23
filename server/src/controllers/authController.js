const OTP = require("../models/OTP");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const sendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        message: "Phone number is required"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.create({
      phoneNumber,
      otp,
      expiresAt
    });

    console.log(`OTP for ${phoneNumber}: ${otp}`);

    res.status(200).json({
      message: "OTP sent successfully"
    });

  } catch (error) {
    console.error("Send OTP error:", error);

    res.status(500).json({
      message: "Failed to send OTP"
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({
        message: "Phone number and OTP are required"
      });
    }

    const otpRecord = await OTP.findOne({
      phoneNumber
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        message: "OTP not found"
      });
    }

    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({
        message: "OTP has expired"
      });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    // Check whether the user already exists
    let user = await User.findOne({
      phoneNumber
    });

    if (!user) {
      user = await User.create({
        phoneNumber,
        emailId: `${phoneNumber}@phonemail.com`
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        phoneNumber: user.phoneNumber
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    return res.status(200).json({
      message: "OTP verified successfully",
      token,
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        emailId: user.emailId
      }
    });

  } catch (error) {
    console.error("Verify OTP error:", error);

    res.status(500).json({
      message: "Failed to verify OTP"
    });
  }
};

module.exports = {
  sendOTP,
  verifyOTP
};