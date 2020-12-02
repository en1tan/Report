const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const deletedRepliesSchema = new Schema({
    publicUserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PublicUser",
  },
  messageReplyID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MessageReplies",
  },

  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

const DeletedReplies = mongoose.model("DeletedReplies", deletedRepliesSchema);

module.exports = DeletedReplies;
