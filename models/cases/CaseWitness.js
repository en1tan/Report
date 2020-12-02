const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

const Schema = mongoose.Schema;

const caseWitnessSchema = new Schema({
  caseWitnessID: {
    type: String,
    default: () => nanoid()
  },
  caseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
  },
  firstNameOfWitness: {
    type: String,
    required: [true, "First Name is required"],
  },
  lastNameOfWitness: {
    type: String,
    required: [true, "First Name is required"],
  },
  middleNameOfWitness: {
    type: String,
    required: [true, "First Name is required"],
  },
  emailOfWitness: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    lowercase: true,
  },
  phoneNumberOfWitness: {
    type: String,
    required: [true, "Please provide your phone number"],
  },
  dobOfWitness: {
    type: Date,
    required: [true, "Please provide your phone number"],
  },
  genderOfWitness: {
    type: String,
    enum: ["Male", "Female", "other"],
    default: "other"
  },
  residentialAddressOfWitness: {
    type: String,
    required: true,
  },
  lgaOfWitness: {
    type: String
  },
  stateOfWitness: {
    type: String
  },
  countryOfWitness: {
    type: String
  },
  witnessOccupation: String,
  witnessOrganizationType: {
      type: String,
      enum: ["Government", "NGO", "Private", "Self Employed", "Others", "Unknown"]
  },
  witnessOrganizationID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
  },
  witnessOrganizationName: String,
  otherDetailsOfWitness: String
});

const CaseWitness = mongoose.model("CaseWitness", caseWitnessSchema);

module.exports = CaseWitness;
