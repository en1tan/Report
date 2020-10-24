const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const caseSchema = new Schema({
  caseTitle: {
    type: String,
    required: [true, "Case title is required"],
  },
  incidentDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  incidentHour: String,
  state: String,
  lga: String,
  address: String,
  incidentDescription: String,
  evidence: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Evidence",
  },
  incidentReportedBy: String,
  reporterName: String,
  contactDetails: String,
  victimReporterRelationship: String,
  victimFullname: String,
  gender: {
    type: String,
    enum: ["Male", "Female", "other"],
    default: "other",
  },
  victimOccupation: String,
  victimAge: Number,
  victimPhoneNumber: String,
  victimEmail: String,
  suspectName: String,
  suspectOccupation: String,
  organizationType: {
    type: String,
    enum: [
      "Government",
      "Ngo",
      "Private",
      "Self Employed",
      "Others",
      "Unknown",
    ],
  },
  organization: {
    type: String,
  },
  otherDetails: String
  // organization: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Organization",
  // },
});

const Case = mongoose.model("Case", caseSchema);

module.exports = Case;
