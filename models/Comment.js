const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    caseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Case",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    comment: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
