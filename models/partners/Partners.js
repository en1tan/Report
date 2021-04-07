const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

const Schema = mongoose.Schema;

const partnerSchema = new Schema({
 
 // Unique identifier of Sorosoke partner Organization
  partnerID: {
    type: String,
    default: () => nanoid()
  },

  // Full Name of Partner Organization
  organisationName: {
    type: String,
    required: [true, "Organisation Name is required"],
  },

  // Organization Contact Email Address
  email: {
    type: String,
    unique: true,
    required: [true, "Contact Email is required"],
    lowercase: true,
  },

  // Organization contact Phone Number 
  phoneNumber: {
    type: String,
    required: [true, "Please provide the phone number"],
  },

  // Organization's Office Address
  address: {
    type: String,
    required: true,
  },

  // LGA of the Organization's Office
  lga: {
    type: String
  },

  // State of the Organization's Office
  state: {
    type: String
  },

  // Country of the Organization's Office
  country: {
    type: String
  },

  // Type of Organization
  organizationType: {
    type: String,
    enum: ["Government", "NGO", "Private", "Others"]
  },

  // CAC Registration Number
  regNumber: {
    type: String,
    required: [true, "Please provide the registration number"],
  },

  // About the Organization
  descriptionOfOrg: {
    type: String,
  },

  // Date and Time the Partner was added on the Platform
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});


const Partner = mongoose.model("Partner", partnerSchema);

module.exports = Partner;
