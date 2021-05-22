const mongoose = require("mongoose");
const { genCategoryID } = require("../../utils/genID");

const Schema = mongoose.Schema;

const caseCategorySchema = new Schema(
  {
    // ID of the categories of Violations
    categoryID: {
      type: String,
      default: genCategoryID,
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

    // Date and time the category was added to the platform
    timestamp: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true },
);

const CaseCategory = mongoose.model(
  "CaseCategory",
  caseCategorySchema,
);

module.exports = CaseCategory;
