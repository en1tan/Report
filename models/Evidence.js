const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const evidenceSchema = new Schema({
    evidence1: String,
    evidence2: String,
    evidence3: String,
    evidence4: String,
    evidence5: String,
});

const Evidence = mongoose.model("Evidence", evidenceSchema);

module.exports = Evidence;
