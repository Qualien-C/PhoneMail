const express = require("express");

const { sendEmail, getEmails, getEmailById, getConversation, replyToEmail, markAsRead, toggleFavorite, getSentEmails, createDraft, getDrafts, moveToTrash, getTrash, moveToSpam, getSpam, restoreEmail, permanentlyDeleteEmail } = require("../controllers/emailController");



const protect = require("../middleware/authMiddleware");
const emailOwner = require("../middleware/emailAuthMiddleware");

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
router.get("/:id", protect, emailOwner, getEmailById);


router.post("/:id/reply", protect, emailOwner, replyToEmail);
router.patch("/:id/read", protect, emailOwner, markAsRead);

router.patch("/:id/favorite", protect, emailOwner, toggleFavorite);
router.patch("/:id/trash", protect, emailOwner, moveToTrash);
router.patch("/:id/spam", protect, emailOwner, moveToSpam);
router.patch("/:id/restore", protect, emailOwner, restoreEmail);
router.delete("/:id", protect, emailOwner, permanentlyDeleteEmail);

module.exports = router;