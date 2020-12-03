const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

const Schema = mongoose.Schema;

const smsSchema = new Schema({
  senderPhone: {
    type: String,
  },
  messageContent: {
    type: String,
  },
  status: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

const sms = mongoose.model("sms", smsSchema);

module.exports = sms;
