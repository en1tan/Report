const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

const Schema = mongoose.Schema;

const partnerSchema = new Schema({
  partnerID: {
    type: String,
    default: () => nanoid()
  },
  organisationName: {
    type: String,
    required: [true, "Organisation Name is required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    lowercase: true,
  },
  phoneNumber: {
    type: String,
    required: [true, "Please provide your phone number"],
  },
  address: {
    type: String,
    required: true,
  },
  lga: {
    type: String
  },
  state: {
    type: String
  },
  country: {
    type: String
  },
  organizationType: {
    type: String,
    enum: ["super-admin", "admin", "user"],
    default: "user",
  },
  regNumber: {
    type: String,
    required: [true, "Please provide your registration number"],
  },
  password: {
    type: String,
    required: [true, "Please provide a pasword"],
    minlength: 4,
  },
  descriptionOfOrg: {
    type: String,
  },
});


const Partner = mongoose.model("Partner", partnerSchema);

module.exports = Partner;
