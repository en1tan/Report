const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

const Schema = mongoose.Schema;

const caseSchema = new Schema({
  
  // Unique identifier of the case on the Sorosoke platform
  caseID: {
    type: String,
    default: () => nanoid()
  },

  // Unique ID of the User reporting the case
  publicUserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PublicUser",
  },

  // ID NBA official that has been assigned the case for follow up and updates
  // Default "NotYetAssigned"
  assignedPartnerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PartnerUser",
  },
  
  // Title of the Case given when publishing the case
  // Default "NotYetAssigned"
  caseTitle: {
    type: String,
    required: [true, "Case title is required"],
  },

  // Where exactly the incident took place
  addressOfIncident: String,

  // Areas Close to the address to help locate it faster
  addressLandmark: String,

  // Date the incident occured
  dateOfIncident: {
    type: Date,
    required: true,
    default: Date.now(),
  },

  // When the incident took place
  hourOfIncident: String,

  // Country the Incident took place
  country: String,

  // State the Incident took place
  state: String,

  // LGA the Incident took place
  lga: String,

  // Describing the Incident
  descriptionOfIncident: String,

  // If the user reporting is the victim
  areYouTheVictim: {
    type: String,
    enum: ["Yes", "No"],
    default: "No",
  },

  // What are the things the case reporter want to be done by the platform
  casePleas: String,

  // Status of the case- "Incidence" when not confirmed- "case" when incident has be confirmed and filed
  caseTypeStatus: {
    type: String,
    enum: ["Incidence", "Case", "QuickReport"],
    default: "Incidence",
  },


  // Summary of all what the case is about by the official handling the case and this will be displayed 
  // when the public is viewing the case. This will be entered when publishing the case
  caseSummary: String,

  // Status if case if visible to the public or not
  publishStatus: {
    type: String,
    enum: ["published", "unPublished"],
    default: "unPublished",
  },

  // ID of the official that published the case; you can only publish a record whose case status is "case"
  publishedBy: {
    type: String
  },

  // If the case has been resolved and closed or unresolved and open
  resolutionStatus: {
    type: String,
    enum: ["resolved", "unResolved"],
    default: "unResolved",
  },

  // If the case has been verified
  verificationStatus: {
    type: String,
    enum: ["verified", "unVerified"],
    default: "unVerified",
  },

  // Which of the sorosoke platforms was used in reporting the case
  platformOfReport: {
    type: String,
    enum: ["mobile", "web", "sms"],
    default: "web",
  },

  // Date and time the incident was reported on the sorosoke platform
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

const Case = mongoose.model("Case", caseSchema);

module.exports = Case;
