const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const organizationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Government", "NGO", "Private", "Self Employed", "Others", "Unknown"]
  },
  phoneNumber1: {
    type: String,
    required: true,
  },
  phoneNumber2: {
    type: String,
  },
});

const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;
