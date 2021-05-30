const mongoose = require("mongoose");
const { genIDs } = require("../../utils/genID");

const Schema = mongoose.Schema;

const caseVictimSchema = new Schema(
  {
    // Victim's ID
    caseVictimID: {
      type: String,
    },

    // ID of the case the victim is linked to
    caseID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
    },

    // first name of victim
    firstNameOfVictim: {
      type: String,
      required: [true, "First Name is required"],
    },

    // last name of victim
    lastNameOfVictim: {
      type: String,
      required: [true, "Last Name is required"],
    },

    // middle name of victim
    middleNameOfVictim: {
      type: String,
    },

    // email address of victim
    emailOfVictim: {
      type: String,
      lowercase: true,
    },

    // mobile number of victim
    phoneNumberOfVictim: {
      type: String,
      required: [true, "Please provide the Phone Number"],
    },

    // Age group of victim- 0-5, 6-11, 12-17, 18 - above
    victimAgegroup: String,

    // Gender of victim
    genderOfVictim: {
      type: String,
      enum: ["Male", "Female"],
    },

    // Address of residence
    residentialAddressOfVictim: {
      type: String,
      required: true,
    },

    // Areas Close to the address to help locate it faster
    addressLandmark: String,

    // LGA of Residence
    lgaOfVictim: {
      type: String,
    },

    // State of Residence
    stateOfVictim: {
      type: String,
    },

    // Country of Residence
    countryOfVictim: {
      type: String,
    },

    // What the victim does for a living
    victimOccupation: String,

    // Organization Type
    victimOrganizationType: {
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
    victimOrganizationID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },

    // Name of the organization
    victimOrganizationName: String,

    // more details about the victim
    otherDetailsOfVictim: String,

    // ID of who added the victim to the case Whether a user or Official
    addedBy: String,

    // if the victim has any disability
    disabilityStatus: String,

    // Religious oreintation of the victim
    religion: String,

    // Reporter (user) relationship with the victim
    relationshipWithVictim: String,
  },
  { timestamps: true }
);

caseVictimSchema.pre("save", function (next) {
  this.caseVictimID = genIDs("SCEV");
  next();
});

const CaseVictim = mongoose.model("CaseVictim", caseVictimSchema);

module.exports = CaseVictim;
