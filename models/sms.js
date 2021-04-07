const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

const Schema = mongoose.Schema;

const smsSchema = new Schema({
  
  // Phone number used in sending message
  senderPhone: {
    type: String,
  },

  // Content of the SMS recieved
  messageContent: {
    type: String,
  },

  // Status of the message if it has been treated by the officials
  status: {
    type: String,
  },

  // Date and time when the message was recieved on the platform
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

const sms = mongoose.model("sms", smsSchema);

module.exports = sms;
