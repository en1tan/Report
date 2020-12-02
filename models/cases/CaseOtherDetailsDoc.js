const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  10
);

const Schema = mongoose.Schema;

const caseOtherDetailsDocSchema = new Schema({
  caseOtherDetailsID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CaseOtherDetails",
  },
  docID: {
      type: String
  },
  docTitle: {
      type: String
  },
  URL: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

const CaseOtherDetailsDoc = mongoose.model("CaseOtherDetailsDoc", caseOtherDetailsDocSchema);

module.exports = CaseOtherDetailsDoc;
