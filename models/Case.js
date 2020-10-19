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
  ward: String,
  incidentDescription: String,
  evidence: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Evidence",
  },
  reporterName: String,
  reporterEmail: String,
  reporterPhoneNumber: String,
  victimReporterRelationship: String,
  victimFullname: String,
  victimGender: {
    type: String,
    enum: ["male", "female", "other"],
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
  },
});

const Case = mongoose.model("Case", caseSchema);

module.exports = Case;
