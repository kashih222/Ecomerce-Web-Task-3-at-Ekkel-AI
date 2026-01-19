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

// CORS
const allowedOrigins = [
  process.env.CLIENT_URL_PROD, 
  "http://localhost:5173",
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

// JWT middleware
app.use((req, res, next) => {
  console.log("AUTH HEADERS:", req.headers.authorization); 
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
      console.log("JWT USER:", req.user); 
    } catch {
      req.user = null;
    }
  } else {
    console.log("NO AUTH HEADER"); 
  }

  next();
});

// Test route to check if server is running
app.get("/", (req, res) => {
  res.send("✅ Backend server is running!");
});

// Apollo Server
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

// MongoDB
await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB connected");

const PORT = process.env.PORT || 4100;
app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
});
