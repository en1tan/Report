const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("0123456789", 10);

const Schema = mongoose.Schema;

const caseProgressSchema = new Schema({
  progressID: {
    type: String,
    default: () => nanoid(),
  },
  caseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
  },
  publicUserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PublicUser",
  },
  partnerUserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PartnerUser",
  },
  title: {
    type: String,
    required: true,
  },
  messageContent: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

const CaseProgress = mongoose.model("CaseProgress", caseProgressSchema);

module.exports = CaseProgress;
