const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const followCaseSchema = new Schema({
  // ID of the case the user is following
  caseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
  },

  // ID of the user following the case; users can only follow cases they did not create
  publicUserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PublicUser",
  },

  // Whether a user is still following a case or not
  followStatus: {
    type: Boolean,
    default: true,
  },
});

const FollowCase = mongoose.model("FollowCase", followCaseSchema);

module.exports = FollowCase;
