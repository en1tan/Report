const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

const Schema = mongoose.Schema;

const caseSchema = new Schema({
  caseID: {
    type: String,
    default: () => nanoid()
  },
  publicUserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PublicUser",
  },
  assignedPartnerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PartnerUser",
  },
  caseTitle: {
    type: String,
    required: [true, "Case title is required"],
  },
  addressOfIncident: String,
  dateOfIncident: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  hourOfIncident: String,
  timeOfIncident: String,
  country: String,
  state: String,
  lga: String,
  descriptionOfIncident: String,
  areYouTheVictim: {
    type: String,
    enum: ["Yes", "No"],
    default: "No",
  },
  relationshipWithVictim: String,
  caseTypeStatus: {
    type: String,
    enum: ["Incidence", "Case"],
    default: "Incidence",
  },
  publishStatus: {
    type: String,
    enum: ["published", "unPublished"],
    default: "unPublished",
  },
  publishBy: {
    type: String
  },
  resolutionStatus: {
    type: String,
    enum: ["resolved", "unResolved"],
    default: "unResolved",
  },
  verificationStatus: {
    type: String,
    enum: ["verified", "unVerified"],
    default: "unVerified",
  },
  platformOfReport: {
    type: String,
    enum: ["mobile", "web", "sms"],
    default: "web",
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

const Case = mongoose.model("Case", caseSchema);

module.exports = Case;
