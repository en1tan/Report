const mongoose = require("mongoose");
const { genProgressDocID } = require("../../utils/genID");

const Schema = mongoose.Schema;

const caseProgressDocSchema = new Schema(
  {
    // ID of the File
    docID: {
      type: String,
      default: genProgressDocID,
    },

    // ID of the Case Progress
    caseProgressID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CaseProgress",
    },

    // Name of File
    docTitle: {
      type: String,
      required: true,
    },

    // Link to the file
    URL: {
      type: String,
    },

    // Date and Time the file was added
    timestamp: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true },
);

const CaseProgressDoc = mongoose.model(
  "CaseProgressDoc",
  caseProgressDocSchema,
);

module.exports = CaseProgressDoc;
