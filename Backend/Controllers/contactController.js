const ContactUs = require("../Model/ContactMessage");

// Submit Contact Form
const sendMessage = async (req, res) => {
  try {
    const { fullName, email, subject, message } = req.body;

    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newMessage = await ContactUs.create({
      fullName,
      email,
      subject,
      message,
      createdBy: req.user ? req.user.id : null,
    });

    res.json({
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error submitting message:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Messages (Admin Only)
const getAllMessages = async (req, res) => {
  try {
    // Optional: Check admin role
    // if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const messages = await ContactUs.find().sort({ createdAt: -1 });

    res.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Single Message
const getMessageById = async (req, res) => {
  try {
    const message = await ContactUs.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    res.json({ message });
  } catch (error) {
    console.error("Error fetching message:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Message
const deleteMessage = async (req, res) => {
  try {
    await ContactUs.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  sendMessage,
  getAllMessages,
  getMessageById,
  deleteMessage,
};
