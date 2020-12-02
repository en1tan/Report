const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  10
);

const Schema = mongoose.Schema;

const caseEvidenceSchema = new Schema({
  fileID: {
    type: String,
    default: () => nanoid(),
  },
  caseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
  },
  fileName: {
    type: String,
  },
  URL: {
    type: String,
  },
  dateAdded: {
    type: Date,
    default: Date.now(),
  },
});

const CaseEvidence = mongoose.model("CaseEvidence", caseEvidenceSchema);

module.exports = CaseEvidence;
