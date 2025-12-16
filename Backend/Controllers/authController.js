const User = require("../Model/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

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
const registerUser = async (req, res) => {
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
};

// Login user
const loginUser = async (req, res) => {
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
};

// Get logged-in user info
const getMe = async (req, res) => {
  try {
    const token = req.cookies?.token; 
    if (!token) {
      return res.status(200).json({ message: "Not authenticated", user: null });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(200).json({ message: "Invalid token", user: null });
    }

    // Find user by ID
    const user = await User.findById(decoded.id).select("-password"); 
    if (!user) {
      return res.status(200).json({ message: "User not found", user: null });
    }

    res.status(200).json({
      message: "User fetched successfully",
      user:{
        id : user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Logout user
const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0), 
  });

  res.status(200).json({ message: "Logged out successfully" });
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user role
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User role updated successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  getAllUsers,
  updateRole,
};
