const express = require("express");

const { getMe, updateMe, searchUser } = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");


const router = express.Router();

router.get("/me", protect, getMe);

router.patch("/me", protect, updateMe);

router.get("/search", protect, searchUser);

module.exports = router;