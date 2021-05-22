const mongoose = require("mongoose");
const { genSuspectID } = require("../../utils/genID");

const Schema = mongoose.Schema;

const caseSuspectSchema = new Schema(
  {
    // Suspect's ID
    caseSuspectID: {
      type: String,
      default: genSuspectID,
    },

    // Case Identification code of which this suspect is related to
    caseID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
    },

    // first name of suspect
    firstNameOfSuspect: {
      type: String,
      required: [true, "First Name is required"],
    },

    // last name of suspect
    lastNameOfSuspect: {
      type: String,
      required: [true, "Last Name is required"],
    },

    // middle name of suspect
    middleNameOfSuspect: {
      type: String,
      required: [true, "Middle Name is required"],
    },

    // Email address of suspect
    emailOfSuspect: {
      type: String,
      lowercase: true,
    },

    // Phone number of suspect
    phoneNumberOfSuspect: {
      type: String,
      required: [true, "Please provide the Phone Number"],
    },

    // Age group of victim- 0-5, 6-11, 12-17, 18 - above
    suspectAgegroup: String,

    // Gender of suspect
    genderOfSuspect: {
      type: String,
      enum: ["Male", "Female"],
    },

    // If the suspect is guilty or not
    guiltStatus: {
      type: String,
      enum: ["Guilty", "Not-guilty", "Accomplice"],
      default: "Not-guilty",
    },

    // residential address of suspect
    residentialAddressOfSuspect: {
      type: String,
      required: true,
    },

    // LGA of suspect
    lgaOfSuspect: {
      type: String,
    },

    // state of suspect
    stateOfSuspect: {
      type: String,
    },

    // suspect country of residence
    countryOfSuspect: {
      type: String,
    },

    // What the suspect does for a living
    suspectOccupation: String,

    // Organization type
    suspectOrganizationType: {
      type: String,
      enum: [
        "Government",
        "NGO",
        "Private",
        "Self Employed",
        "Others",
        "Unknown",
      ],
    },

    // Selected organization's ID if available on the system
    suspectOrganizationID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },

    // Name of the organization
    suspectOrganizationName: String,

    // more details about the suspect
    otherDetailsOfSuspect: String,

    // ID of who added the suspect to the case Whether a user or Official
    addedBy: String,

    // if the suspect has any disability
    disabilityStatus: String,

    // Areas Close to the address to help locate it faster
    addressLandmark: String,

    // Religious oreintation of the suspect
    religion: String,

    // suspect relationship with the victim
    relationshipWithVictim: String,

    // Timestamp when the suspect was added on the platform
    timestamp: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true },
);

const CaseSuspect = mongoose.model("CaseSuspect", caseSuspectSchema);

module.exports = CaseSuspect;
