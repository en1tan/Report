const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("0123456789", 10);

const Schema = mongoose.Schema;

const caseProgressSchema = new Schema({
  // Unique Identifier of the case progress
  progressID: {
    type: String,
    default: () => nanoid(),
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

  // Date the progress report was added
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

const CaseProgress = mongoose.model(
  "CaseProgress",
  caseProgressSchema,
);

module.exports = CaseProgress;
