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
    required: [true, "Last Name is required"],
  },
  middleNameOfWitness: {
    type: String,
  },
  emailOfWitness: {
    type: String,
    unique: true,
    lowercase: true,
  },
  phoneNumberOfWitness: {
    type: String,
    required: [true, "Please provide the Phone Number"],
  },
  dobOfWitness: {
    type: Date,
    required: [true, "Please provide the Date of Birth"],
  },
  genderOfWitness: {
    type: String,
    enum: ["Male", "Female"],
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
  otherDetailsOfWitness: String,
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

const CaseWitness = mongoose.model("CaseWitness", caseWitnessSchema);

module.exports = CaseWitness;
