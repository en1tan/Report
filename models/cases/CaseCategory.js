const mongoose = require("mongoose");
const { genIDs } = require("../../utils/genID");

const Schema = mongoose.Schema;

const caseCategorySchema = new Schema(
  {
    // ID of the categories of Violations
    categoryID: {
      type: String,
    },

    // The Human right Violation Classification Group that this category belongs to
    categoryGroupID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CaseCategoryID",
    },

    // Title of the category
    categoryName: {
      type: String,
    },

    // Explanation of the Category
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

caseCategorySchema.pre("save", function (next) {
  this.categoryID = genIDs("SCAT");
  next();
});

const CaseCategory = mongoose.model(
  "CaseCategory",
  caseCategorySchema
);

module.exports = CaseCategory;
