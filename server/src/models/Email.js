const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true
    },

    recipients: [
      {
        type: String,
        required: true
      }
    ],

    cc: [
      {
        type: String
      }
    ],

    subject: {
      type: String,
      default: ""
    },

    body: {
      type: String,
      required: true
    },

    threadId: {
      type: String,
      required: true
    },

    isRead: {
      type: Boolean,
      default: false
    },

    isFavorite: {
      type: Boolean,
      default: false
    },

    hasReplied: {
      type: Boolean,
      default: false
    },

    folder: {
      type: String,
      enum: ["inbox", "sent", "trash"],
      default: "inbox"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Email", emailSchema);