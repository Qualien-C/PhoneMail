const Email = require("../models/Email");

const sendEmail = async (req, res) => {
  try {
    const { recipients, cc, subject, body, threadId } = req.body;

    if (!recipients || recipients.length === 0) {
      return res.status(400).json({
        message: "At least one recipient is required"
      });
    }

    if (!body) {
      return res.status(400).json({
        message: "Email body is required"
      });
    }

    const email = await Email.create({
      sender: req.user.phoneNumber,
      recipients,
      cc: cc || [],
      subject: subject || "",
      body,
      threadId: threadId || Date.now().toString()
    });

    res.status(201).json({
      message: "Email sent successfully",
      email
    });

  } catch (error) {
    console.error("Send email error:", error);

    res.status(500).json({
      message: "Failed to send email"
    });
  }
};

module.exports = { sendEmail };