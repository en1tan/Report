const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

const Schema = mongoose.Schema;

const caseSuspectSchema = new Schema({
  caseSuspectID: {
    type: String,
    default: () => nanoid()
  },
  caseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
  },
  firstNameOfSuspect: {
    type: String,
    required: [true, "First Name is required"],
  },
  lastNameOfSuspect: {
    type: String,
    required: [true, "First Name is required"],
  },
  middleNameOfSuspect: {
    type: String,
    required: [true, "First Name is required"],
  },
  emailOfSuspect: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    lowercase: true,
  },
  phoneNumberOfSuspect: {
    type: String,
    required: [true, "Please provide your phone number"],
  },
  dobOfSuspect: {
    type: Date,
    required: [true, "Please provide your phone number"],
  },
  genderOfSuspect: {
    type: String,
    enum: ["Male", "Female", "other"],
    default: "other"
  },
  residentialAddressOfSuspect: {
    type: String,
    required: true,
  },
  lgaOfSuspect: {
    type: String
  },
  stateOfSuspect: {
    type: String
  },
  countryOfSuspect: {
    type: String
  },
  suspectOccupation: String,
  suspectOrganizationType: {
      type: String,
      enum: ["Government", "NGO", "Private", "Self Employed", "Others", "Unknown"]
  },
  suspectOrganizationID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
  },
  suspectOrganizationName: String,
  otherDetailsOfSuspect: String
});

const CaseSuspect = mongoose.model("CaseSuspect", caseSuspectSchema);

module.exports = CaseSuspect;
