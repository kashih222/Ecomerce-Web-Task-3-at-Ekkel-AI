import express from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import typeDefs from "./schemaGql.js";
import resolvers from "./resolver.js";

dotenv.config();

const app = express();

// CORS configuration
const allowedOrigins = [
  "https://kashihstor.netlify.app",
  "http://localhost:5173",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());

// JWT middleware
app.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.log("JWT verification failed:", err.message);
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
});

// Test route to check if server is running
app.get("/", (req, res) => {
  res.send("✅ Backend server is running!");
});

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({
    user: req.user,
    res,
  }),
});

await server.start();
server.applyMiddleware({
  app,
  path: "/graphql",
  cors: false, 
});

// Connect to MongoDB
try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");
} catch (err) {
  console.error("❌ MongoDB connection error:", err);
}

const PORT = process.env.PORT || 4100;
app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
});
