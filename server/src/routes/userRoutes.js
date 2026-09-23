const express = require("express");

const { getMe, updateMe } = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", protect, getMe);
// HTTP method used to apply partial modifications to an existing resource on a server
router.patch("/me", protect, updateMe);

module.exports = router;