const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  10
);

const Schema = mongoose.Schema;

const caseOtherDetailsSchema = new Schema({
  caseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
  },
  from: {
    type: String,
    enum: ["admin", "user"]
  },
  userID: {
      type: String
  },
  message: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

const CaseOtherDetails = mongoose.model("CaseOtherDetails", caseOtherDetailsSchema);

module.exports = CaseOtherDetails;
