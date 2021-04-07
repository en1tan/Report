const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  10
);

const Schema = mongoose.Schema;

const caseOtherDetailsDocSchema = new Schema({
  
  // Unique Identifier of the extra conversation on a case beteen the reporter and official
  caseOtherDetailsID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CaseOtherDetails",
  },

  // Unique Identifier of the file attached to a reply convo
  docID: {
    type: String,
    default: () => nanoid(),
  },

  // Document Title
  docTitle: {
    type: String,
  },

  // Path or link to which the file is saved
  URL: {
    type: String,
  },

  // Date and Time the file was uploaded
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

const CaseOtherDetailsDoc = mongoose.model(
  "CaseOtherDetailsDoc",
  caseOtherDetailsDocSchema
);

module.exports = CaseOtherDetailsDoc;
