const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

const Schema = mongoose.Schema;

const organizationSchema = new Schema({

  // Unique Identification code for the organization on the platform
  orgID: {
    type: String,
    default: () => nanoid()
  },

  // Full Name of the organization
  orgName: {
    type: String,
    required: true,
  },

  // Type of Organization
  orgType: {
    type: String,
    enum: ["Government", "NGO", "Private", "Others"]
  },

  // What the organization do; portfolio
  description: {
    type: String
  },

  // Organization contact email 1
  email1: {
    type: String,
    required: true,
  },

  // Organization contact email 2
  email2: {
    type: String,
    required: true,
  },

  // Organization contact email 3
  email3: {
    type: String,
    required: true,
  },

  // Organization's Office Address
  address: {
    type: String,
    required: true,
  },

  // Areas Close to the address to help locate it faster
  addressLandmark: {
    type: String,
    required: true,
  },

  // Organization contact phone 1
  phone1: {
    type: String,
    required: true,
  },

  // Organization contact phone 2
  phone2: {
    type: String,
  },

  // Organization contact phone 3
  phone3: {
    type: String,
  },

  // LGA of the Organization's Office
  lga: {
    type: String,
  },

  // State of the Organization's Office
  state: {
    type: String,
  },

  // Country of the Organization's Office
  country: {
    type: String,
  },

    // CAC Registration Certificate No.
    cacRegNo: {
      type: String,
    },

  // This specifies whether this record is HQ or Branch of the organization
  hqorbranch: {
    type: String,
  },

  // ID of the official that added the organization to the platform 
addedBy: String,

  // Date and Time the Organization was added on the platform
  timestamp: {
    type: Date,
    default: Date.now()
  },

  // Date and time the record was updated last
  dateUpdated: {
    type: Date,
    default: Date.now()
  },
});

const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;
