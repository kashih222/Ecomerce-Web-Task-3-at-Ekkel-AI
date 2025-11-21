const express = require("express"); 
const User = require("../Model/User");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey"; 

const router = express.Router();

// Register user
router.post("/registeruser", async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ fullname, email, password });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, fullname: user.fullname, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" } // token valid for 1 hour
    );

    res.status(201).json({
      message: "User registered successfully",
      user,
      token, // return JWT token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login route 
router.post("/login", async (req, res) => {
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

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, fullname: user.fullname, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
      token, 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
