const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const caseOtherDetailsSchema = new Schema(
  {
    // ID of Case
    caseID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
    },

    // Who sent the reply
    from: {
      type: String,
      enum: ["super-admin", "admin", "staff", "verifier", "user"],
    },

    // ID of the person sending reply
    userID: {
      type: mongoose.Schema.Types.ObjectId,
    },

    // Message content
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

const CaseOtherDetails = mongoose.model(
  "CaseOtherDetails",
  caseOtherDetailsSchema
);

module.exports = CaseOtherDetails;
