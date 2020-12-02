const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const caseTaggedCategoriesSchema = new Schema({
  caseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
  },
  caseCategoryID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CaseCategory",
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

const CaseTaggedCategories = mongoose.model(
  "CaseTaggedCategories",
  caseTaggedCategoriesSchema
);

module.exports = CaseTaggedCategories;
