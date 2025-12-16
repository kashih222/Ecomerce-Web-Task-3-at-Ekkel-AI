const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getAllMessages,
  getMessageById,
  deleteMessage,
} = require("../Controllers/contactController");

// Submit Contact Form
router.post("/send-message", sendMessage);

// Get All Messages (Admin Only)
router.get("/all-messages", getAllMessages);

// Get Single Message
router.get("/message/:id", getMessageById);

// Delete Message
router.delete("/delete/:id", deleteMessage);

module.exports = router;
