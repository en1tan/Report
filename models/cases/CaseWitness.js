const mongoose = require("mongoose");
const { genIDs } = require("../../utils/genID");

const Schema = mongoose.Schema;

const caseWitnessSchema = new Schema(
  {
    // Witness ID
    caseWitnessID: {
      type: String,
    },

    // Case ID that the witness is linked to
    caseID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
    },

    // First Name of Witness
    firstNameOfWitness: {
      type: String,
      required: [true, "First Name is required"],
    },

    // Last Name of Witness
    lastNameOfWitness: {
      type: String,
      required: [true, "Last Name is required"],
    },

    // Middle Name of Witness
    middleNameOfWitness: {
      type: String,
    },

    // Email address of Witness
    emailOfWitness: {
      type: String,
      unique: true,
      lowercase: true,
    },

    // Phone number of witness
    phoneNumberOfWitness: {
      type: String,
      required: [true, "Please provide the Phone Number"],
    },

    // Age group of witness- 0-5, 6-11, 12-17, 18 - above
    witnessAgeGroup: String,

    // Gender of the witness
    genderOfWitness: {
      type: String,
      enum: ["Male", "Female"],
    },

    // Address of the witness
    residentialAddressOfWitness: {
      type: String,
      required: true,
    },

    // Areas Close to the address to help locate it faster
    addressLandmark: String,

    // Local government of witness address
    lgaOfWitness: {
      type: String,
    },

    // state of witness address
    stateOfWitness: {
      type: String,
    },

    // country of witness address
    countryOfWitness: {
      type: String,
    },

    //  What the witness does for a living
    witnessOccupation: String,

    // Organization Type
    witnessOrganizationType: {
      type: String,
      enum: [
        "Government",
        "NGO",
        "Private",
        "Business Person",
        "Self Employed",
        "Unemployed",
        "Others",
        "Unknown",
      ],
    },

    // Selected organization's ID if available on the system
    witnessOrganizationID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },

    // Name of the organization
    witnessOrganizationName: String,

    // More details about the witnesss
    otherDetailsOfWitness: String,

    // ID of who added the witness to the case Whether a user or Official
    addedBy: String,

    // if the witness has any disability
    disabilityStatus: String,

    // Religious oreintation of the witness
    religion: String,

    // Witness relationship with the victim
    relationshipWithVictim: String,
  },
  { timestamps: true }
);

caseWitnessSchema.pre("save", function (next) {
  this.caseWitnessID = genIDs("SCEW");
  next();
});

const CaseWitness = mongoose.model("CaseWitness", caseWitnessSchema);

module.exports = CaseWitness;
