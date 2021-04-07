const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  10
);

const Schema = mongoose.Schema;

const caseEvidenceSchema = new Schema({
  
  // ID of the file
  fileID: {
    type: String,
    default: () => nanoid(),
  },

  // ID of case in question
  caseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
  },

  // file name
  fileName: {
    type: String,
  },

  // Link path to the file
  URL: {
    type: String,
  },

  // Timestamp when the evidence was added on the platform
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

const CaseEvidence = mongoose.model("CaseEvidence", caseEvidenceSchema);

module.exports = CaseEvidence;
