const express = require("express");
const protect = require("../middleware/authMiddleware");
const { sendOTP, verifyOTP } = require("../controllers/authController");

const router = express.Router();

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

router.get("/me", protect, (req, res) => {
    res.json({
        message: "You are authenticated",
        user: req.user
    });
});

module.exports = router;