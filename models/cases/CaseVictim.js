const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

const Schema = mongoose.Schema;

const caseVictimSchema = new Schema({
  caseVictimID: {
    type: String,
    default: () => nanoid()
  },
  caseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
  },
  firstNameOfVictim: {
    type: String,
    required: [true, "First Name is required"],
  },
  lastNameOfVictim: {
    type: String,
    required: [true, "First Name is required"],
  },
  middleNameOfVictim: {
    type: String,
    required: [true, "First Name is required"],
  },
  emailOfVictim: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    lowercase: true,
  },
  phoneNumberOfVictim: {
    type: String,
    required: [true, "Please provide your phone number"],
  },
  dobOfVictim: {
    type: Date,
    required: [true, "Please provide your phone number"],
  },
  genderOfVictim: {
    type: String,
    enum: ["Male", "Female", "other"],
    default: "other"
  },
  residentialAddressOfVictim: {
    type: String,
    required: true,
  },
  lgaOfVictim: {
    type: String
  },
  stateOfVictim: {
    type: String
  },
  countryOfVictim: {
    type: String
  },
  victimOccupation: String
});

const CaseVictim = mongoose.model("CaseVictim", caseVictimSchema);

module.exports = CaseVictim;
