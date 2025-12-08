const express = require("express");
const User = require("../Model/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

// Helper: send token in HTTP-only cookie
const sendToken = (res, user, message, statusCode = 200) => {
  const token = jwt.sign(
    { id: user._id, fullname: user.fullname, email: user.email },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  // Set HTTP-only cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", 
    sameSite: "strict",
    maxAge: 60 * 60 * 1000, //1h
  });

  res.status(statusCode).json({
    message,
    user: {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      role : user.role,
      token,
    },
  });
};

// Register user
router.post("/registeruser", async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ fullname, email, password });

    sendToken(res, user, "User registered successfully", 201);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login route
router.post("/loginuser", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    sendToken(res, user, "Login successful");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get logged-in user info
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies?.token; 
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find user by ID
    const user = await User.findById(decoded.id).select("-password"); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User fetched successfully",
      user:{
        id : user._id,
        fullname : user.fullname,
        email : user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

// Logout route
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
});


// Fetch all users
router.get("/all-users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ message: "All users fetched successfully", users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user role
router.put("/update-role/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["customer", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User role updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user
router.delete("/delete-user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully", user: deletedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
