const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const caseTaggedCategoriesSchema = new Schema(
  {
    // Unique Identifier of the Case Tag
    caseTagID: {
      type: String,
      default: () => nanoid(),
    },

    // ID of Case
    caseID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
    },

    // ID of the category the case has been tagged to
    caseCategoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CaseCategory",
    },
  },
  { timestamps: true },
);

const CaseTaggedCategories = mongoose.model(
  "CaseTaggedCategories",
  caseTaggedCategoriesSchema,
);

module.exports = CaseTaggedCategories;
