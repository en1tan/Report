const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const followCaseSchema = new Schema({
  caseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
  },
  publicUserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PublicUser",
  },
  followStatus: {
    type: String,
    enum: ["following", "notFollowing"],
    default: "notFollowing",
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

const FollowCase = mongoose.model("FollowCase", followCaseSchema);

module.exports = FollowCase;
