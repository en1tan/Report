const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  10
);

const Schema = mongoose.Schema;

const caseOtherDetailsSchema = new Schema({
  
  // ID of Case
  caseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
  },

  // Who sent the reply
  from: {
    type: String,
    enum: ["admin", "user"]
  },

  // ID of the person sending reply
  userID: {
      type: mongoose.Schema.Types.ObjectId
  },

  // Message content
  message: {
    type: String,
  },

  // Date and Time the message was sent
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

const CaseOtherDetails = mongoose.model("CaseOtherDetails", caseOtherDetailsSchema);

module.exports = CaseOtherDetails;
