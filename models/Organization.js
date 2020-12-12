const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

const Schema = mongoose.Schema;

const organizationSchema = new Schema({

  orgID: {
    type: String,
    default: () => nanoid()
  },
  orgName: {
    type: String,
    required: true,
  },
  orgType: {
    type: String,
    enum: ["Government", "NGO", "Private", "Self Employed", "Others"]
  },
  description: {
    type: String
  },
  email1: {
    type: String,
    required: true,
  },
  email2: {
    type: String,
    required: true,
  },
  email3: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone1: {
    type: String,
    required: true,
  },
  phone2: {
    type: String,
  },
  phone3: {
    type: String,
  },
  lga: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  hqorbranch: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now()
  },
  dateUpdated: {
    type: Date,
    default: Date.now()
  },
});

const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;
