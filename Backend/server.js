const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./Routes/authRoutes");
const productRoutes = require("./Routes/productRoutes")
const cartRoutes = require ("./Routes/cartRoutes");
const authMiddleware = require ("./Middlewares/authMiddleware")
const guestAuthMiddleware = require("./Middlewares/guestAuthMiddleware");
const contactRoutes = require("./Routes/contactRoutes");
const orderRoutes = require ("./Routes/orderRoutes");



const app = express();

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET ; 
console.log(JWT_SECRET)

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Middleware
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true, 
}));
app.use(express.json());


// Routes
app.get("/", (req, res) => {
  res.send("Backend is running...");
});


// User API
app.use("/api/auth/user", authRoutes);
app.use("/api/login", authRoutes);
app.use("/api/loged-me", authRoutes);
app.use("/api/auth/loging", authRoutes);
app.use("/api/auth/fetch-all", authRoutes);
app.use("/api/auth/update", authRoutes);
app.use("/api/auth/delete", authRoutes);

// Product API
app.use("/api/product", productRoutes);
app.use("/api/fetch", productRoutes);
app.use("/api/delete", productRoutes);
app.use("/api/update", productRoutes);
app.use("/api/single-product", productRoutes);
app.use("/api/product-catagory", productRoutes);

// Cart API
app.use("/api/cart", guestAuthMiddleware, cartRoutes);

// Order API
app.use("/api/order", orderRoutes);

// ContactUs API
app.use("/api/contact", contactRoutes);



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

