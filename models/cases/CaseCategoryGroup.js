const mongoose = require("mongoose");
const { genIDs } = require("../../utils/genID");

const Schema = mongoose.Schema;

const caseCategoryGroupSchema = new Schema(
  {
    // Unique Identifier of the Group on the Platform
    categoryGroupID: {
      type: String,
    },

    // Human Rights Group Title
    groupName: {
      type: String,
      required: [true, "Group Name is required"],
      unique: true,
    },
    // Explanation of the type of cases within this group
    description: {
      type: String,
    },

    // Category Icon Image
    imageIcon: {
      type: String,
    },
  },
  { timestamps: true }
);

caseCategoryGroupSchema.pre("save", function (next) {
  this.categoryGroupID = genIDs("SGRP");
  next();
});

caseCategoryGroupSchema.pre("update", function (next) {
  this.categoryGroupID = genIDs("SGRP");
  next();
});

const CaseCategoryGroup = mongoose.model(
  "CaseCategoryGroup",
  caseCategoryGroupSchema
);

module.exports = CaseCategoryGroup;
