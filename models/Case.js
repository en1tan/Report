const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const caseSchema = new Schema({
    caseTitle: {
        type: String,
        required: [true, "Case title is required"]
    },
    incidentDate: {
        type: Date,
        required: true
    },
    incidentHour: String,
    state: String,
    lga: String,
    ward: String,
    incidentDescription: String,
    evidence: [{type: String}],
    reporterName: String,
    contactDetail: String,
    victimRelationship: String,
    victimFullname: String,
    victimGender: {
        type: String,
        enum: ["male", "female", "other"],
        default: "other"
    },
    victimOccupation: String,
    victimAge: Number,
    phoneNumber: String,
    email: String
});

const Case = mongoose.model("Case", caseSchema);

module.exports = Case;
