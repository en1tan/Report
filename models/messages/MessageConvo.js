const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageConvoSchema = new Schema({
    publicUserID1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PublicUser",
  },
  publicUserID2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PublicUser",
  },
  status: {
    type: String,
    enum: ["active", "notActive"],
    default: "notActive",
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

const MessageConvo = mongoose.model("MessageConvo", messageConvoSchema);

module.exports = MessageConvo;
