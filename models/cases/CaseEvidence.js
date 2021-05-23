const mongoose = require("mongoose");
const { genEvidenceID } = require("../../utils/genID");

const Schema = mongoose.Schema;

const caseEvidenceSchema = new Schema(
  {
    // ID of the file
    fileID: {
      type: String,
      default: genEvidenceID,
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
  },
  { timestamps: true },
);

const CaseEvidence = mongoose.model(
  "CaseEvidence",
  caseEvidenceSchema,
);

module.exports = CaseEvidence;
