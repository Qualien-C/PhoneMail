const express = require("express");

const { sendEmail, getEmails } = require("../controllers/emailController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, sendEmail);
router.get("/", protect, getEmails);

module.exports = router;