const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true
    },

    emailId: {
      type: String,
      required: true,
      unique: true
    },

    name: {
      type: String,
      default: ""
    },

    // profilePicture: {
    //   type: String,
    //   default: ""
    // },

    // hasMobileApp: {
    //   type: Boolean,
    //   default: false
    // }
  },
  {
    // this timestamp thingy tells us about 1. createdAt and 2. updatedAt to our mongodb document.
    // if we want functionality to change username, this might be helpful.
    // time of sending and receiving messages/emails aswell
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);