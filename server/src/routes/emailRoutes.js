const express = require("express");

const { sendEmail } = require("../controllers/emailController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, sendEmail);

module.exports = router;