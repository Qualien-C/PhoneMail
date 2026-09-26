const Email = require("../models/Email");

const emailOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const phoneNumber = req.user.phoneNumber;

    const email = await Email.findById(id);

    if (!email) {
      return res.status(404).json({
        message: "Email not found"
      });
    }

    const isSender = email.sender === phoneNumber;

    const isRecipient = email.recipients.includes(phoneNumber);

    const isCC = email.cc.includes(phoneNumber);

    if (!isSender && !isRecipient && !isCC) {
      return res.status(403).json({
        message: "You are not allowed to access this email"
      });
    }

    req.email = email;

    next();

  } catch (error) {
    console.error("Email authorization error:", error);

    res.status(500).json({
      message: "Failed to authorize email access"
    });
  }
}

module.exports = emailOwner;