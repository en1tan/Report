const mongoose = require("mongoose");
const { genIDs } = require("../../utils/genID");

const Schema = mongoose.Schema;

const caseProgressSchema = new Schema(
  {
    // Unique Identifier of the case progress
    progressID: {
      type: String,
    },

    // ID of the Case
    caseID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
    },

    // ID of the public User
    publicUserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PublicUser",
    },

    // ID of the Official Handling the Case
    partnerUserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PartnerUser",
    },

    // Title of the Progress Report
    title: {
      type: String,
      required: true,
    },

    // Report Content
    messageContent: {
      type: String,
      required: true,
    },

    privacyStatus: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },
    progressDocs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CaseProgressDoc",
      },
    ],
  },
  { timestamps: true },
);

caseProgressSchema.pre("save", function (next) {
  this.progressID = genIDs("SPGD");
  next();
});

const CaseProgress = mongoose.model(
  "CaseProgress",
  caseProgressSchema,
);

module.exports = CaseProgress;
