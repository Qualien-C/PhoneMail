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

const getEmails = async (req, res) => {
  try {
    const phoneNumber = req.user.phoneNumber;

    const emails = await Email.find({
      recipients: phoneNumber
    }).sort({ createdAt: -1 });

    res.status(200).json({
      emails
    });

  } catch (error) {
    console.error("Get emails error:", error);

    res.status(500).json({
      message: "Failed to fetch emails"
    });
  }
};


const getEmailById = async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);

    if (!email) {
      return res.status(404).json({
        message: "Email not found"
      });
    }

    res.status(200).json({
      email
    });

  } catch (error) {
    console.error("Get email error:", error);

    res.status(500).json({
      message: "Failed to fetch email"
    });
  }
};



const getConversation = async (req, res) => {
  try {
    const { threadId } = req.params;

    const emails = await Email.find({
      threadId
    }).sort({ createdAt: 1 });

    if (emails.length === 0) {
      return res.status(404).json({
        message: "Conversation not found"
      });
    }

    res.status(200).json({
      emails
    });

  } catch (error) {
    console.error("Get conversation error:", error);

    res.status(500).json({
      message: "Failed to fetch conversation"
    });
  }
};


const replyToEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req.body;

    if (!body) {
      return res.status(400).json({
        message: "Reply body is required"
      });
    }

    const originalEmail = await Email.findById(id);

    if (!originalEmail) {
      return res.status(404).json({
        message: "Original email not found"
      });
    }

    if (originalEmail.hasReplied) {
      return res.status(400).json({
        message: "This email has already been replied to"
      });
    }

    const currentUser = req.user.phoneNumber;

    const recipient = originalEmail.sender;

    const reply = await Email.create({
      sender: currentUser,
      recipients: [recipient],
      subject: originalEmail.subject.startsWith("Re:")
        ? originalEmail.subject
        : `Re: ${originalEmail.subject}`,
      body,
      threadId: originalEmail.threadId,
      folder: "sent"
    });

    originalEmail.hasReplied = true;
    await originalEmail.save();

    res.status(201).json({
      message: "Reply sent successfully",
      email: reply
    });

  } catch (error) {
    console.error("Reply error:", error);

    res.status(500).json({
      message: "Failed to send reply"
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const email = await Email.findById(id);

    if (!email) {
      return res.status(404).json({
        message: "Email not found"
      });
    }

    email.isRead = true;

    await email.save();

    res.status(200).json({
      message: "Email marked as read",
      email
    });

  } catch (error) {
    console.error("Mark as read error:", error);

    res.status(500).json({
      message: "Failed to mark email as read"
    });
  }
};



module.exports = { sendEmail, getEmails, getEmailById, getConversation, replyToEmail, markAsRead };