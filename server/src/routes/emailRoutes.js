const express = require("express");

const { sendEmail, getEmails, getEmailById, getConversation, replyToEmail, markAsRead } = require("../controllers/emailController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, sendEmail);
router.get("/", protect, getEmails);
router.get("/thread/:threadId", protect, getConversation);
router.get("/:id", protect, getEmailById);
router.post("/:id/reply", protect, replyToEmail);
router.patch("/:id/read", protect, markAsRead);


module.exports = router;