const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getMe, logoutUser, getAllUsers, updateRole } = require("../Controllers/authController");

// Register user
router.post("/registeruser", registerUser);

// Login route
router.post("/loginuser", loginUser);

// Get logged-in user info
router.get("/me", getMe);

// Logout route
router.post("/logout", logoutUser);

// Get all users
router.get("/all-users", getAllUsers);

// Update user role
router.put("/update-role/:id", updateRole);

module.exports = router;
