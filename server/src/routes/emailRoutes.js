const express = require("express");

const { sendEmail, getEmails, getEmailById, getConversation, replyToEmail, markAsRead, toggleFavorite, getSentEmails, createDraft, getDrafts, moveToTrash, getTrash, moveToSpam, getSpam, restoreEmail, permanentlyDeleteEmail } = require("../controllers/emailController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, sendEmail);
router.get("/", protect, getEmails);

router.get("/thread/:threadId", protect, getConversation);

router.get("/sent", protect, getSentEmails);

router.post("/drafts", protect, createDraft);
router.get("/drafts", protect, getDrafts);

router.get("/trash", protect, getTrash);
router.get("/spam", protect, getSpam);


//!
router.get("/:id", protect, getEmailById);


router.post("/:id/reply", protect, replyToEmail);
router.patch("/:id/read", protect, markAsRead);

router.patch("/:id/favorite", protect, toggleFavorite);
router.patch("/:id/trash", protect, moveToTrash);
router.patch("/:id/spam", protect, moveToSpam);
router.patch("/:id/restore", protect, restoreEmail);
router.delete("/:id", protect, permanentlyDeleteEmail);

module.exports = router;