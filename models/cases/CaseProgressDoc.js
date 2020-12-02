const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  10
);

const Schema = mongoose.Schema;

const caseProgressDocSchema = new Schema({
  caseProgressID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CaseProgress",
  },
  docID: {
    type: String,
    default: () => nanoid(),
  },
  docTitle: {
    type: String,
    required: true,
  },
  URL: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

const CaseProgressDoc = mongoose.model("CaseProgressDoc", caseProgressDocSchema);

module.exports = CaseProgressDoc;
