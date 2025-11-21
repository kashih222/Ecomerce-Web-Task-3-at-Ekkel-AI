const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./Routes/authRoutes");
const productRoutes = require("./Routes/productRoutes")

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// User API
app.use("/api/auth", authRoutes);
app.use("/api/login", authRoutes);

// Product API
app.use("/api/product", productRoutes);
app.use("/api/fetch", productRoutes);
app.use("/api/delete", productRoutes);
app.use("/api/update", productRoutes);
app.use("/api/single-product", productRoutes);



// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
