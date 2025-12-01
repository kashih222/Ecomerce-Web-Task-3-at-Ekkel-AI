const  mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        default: null,
    }
  },
  { timestamps: true }
);

module.exports=  mongoose.model("ContactMessage", contactMessageSchema);

