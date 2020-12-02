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
    required: [true, "Last Name is required"],
  },
  middleNameOfVictim: {
    type: String,
  },
  emailOfVictim: {
    type: String,
    unique: true,
    lowercase: true,
  },
  phoneNumberOfVictim: {
    type: String,
    required: [true, "Please provide the Phone Number"],
  },
  dobOfVictim: {
    type: Date,
    required: [true, "Please provide the Date of Birth"],
  },
  genderOfVictim: {
    type: String,
    enum: ["Male", "Female"],
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
  victimOccupation: String,
  victimOrganizationType: {
    type: String,
    enum: ["Government", "NGO", "Private", "Self Employed", "Others", "Unknown"]
},
victimOrganizationID: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Organization",
},
victimOrganizationName: String,
otherDetailsOfVictim: String,
timestamp: {
  type: Date,
  default: Date.now(),
},
});

const CaseVictim = mongoose.model("CaseVictim", caseVictimSchema);

module.exports = CaseVictim;
