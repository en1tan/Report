const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    caseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Case",
    },
    publicUserID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PublicUser",
    },
    comment: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now()
    }
});

const CaseComment = mongoose.model("CaseComment", commentSchema);

module.exports = CaseComment;
