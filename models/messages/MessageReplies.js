const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageRepliesSchema = new Schema({
    publicUserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PublicUser",
  },
  messageConvoID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MessageConvo",
  },
  messageContent: {
    type: String,
  },
  messageStatus: {
    type: String,
    enum: ["read", "unRead"],
    default: "unRead",
  },
  deleteStatus: {
    type: String,
    enum: ["deleted", "notDeleted"],
    default: "notDeleted",
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

const MessageReplies = mongoose.model("MessageReplies", messageRepliesSchema);

module.exports = MessageReplies;
