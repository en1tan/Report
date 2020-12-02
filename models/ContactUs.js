const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

const Schema = mongoose.Schema;

const contactUsSchema = new Schema({
  ticketID: {
    type: String,
    default: () => nanoid()
  },
  senderName: {
    type: String,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PublicUser",
  },
  phoneNumber: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  subject: {
    type: String,
    required: [true, "Subject is required"],
  },
  message: {
    type: String,
    required: [true, "Message is required"],
  },
  status: {
      type: String
  },

});

const ContactUs = mongoose.model("ContactUs", contactUsSchema);

module.exports = ContactUs;
