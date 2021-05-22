const mongoose = require("mongoose");
const { genCategoryGroupID } = require("../../utils/genID");

const Schema = mongoose.Schema;

const caseCategoryGroupSchema = new Schema(
  {
    // Unique Identifier of the Group on the Platform
    categoryGroupID: {
      type: String,
      default: genCategoryGroupID,
    },

    // Human Rights Group Title
    groupName: {
      type: String,
      required: [true, "Group Name is required"],
    },
    // Explanation of the type of cases within this group
    description: {
      type: String,
    },

    // Category Icon Image
    imageIcon: {
      type: String,
    },

    // Date and Time the group was added on the platform
    timestamp: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true },
);

const CaseCategoryGroup = mongoose.model(
  "CaseCategoryGroup",
  caseCategoryGroupSchema,
);

module.exports = CaseCategoryGroup;
