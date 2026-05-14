const express = require("express");
const { register, login, getMe, logout, getAllUsers } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

// Development route - view all users
router.get("/all", getAllUsers);

module.exports = router;
