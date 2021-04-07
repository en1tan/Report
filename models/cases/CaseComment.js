const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    
    // ID of Case that has the comments
    caseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Case",
    },

    // ID of the commenter
    publicUserID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PublicUser",
    },

    // Comment contents
    comment: {
        type: String,
        required: true
    },

    // Timestamp when the comment was added on the platform
    timestamp: {
        type: Date,
        default: Date.now()
    }
});

const CaseComment = mongoose.model("CaseComment", commentSchema);

module.exports = CaseComment;
