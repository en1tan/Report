const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  userID: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
    default: 0,
  },
  otpVerified: {
    type: Boolean,
    default: false,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600,
  },
});

module.exports = mongoose.model("Token", tokenSchema);
