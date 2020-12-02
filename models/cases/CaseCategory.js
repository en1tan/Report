const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  10
);

const Schema = mongoose.Schema;

const caseCategorySchema = new Schema({
  categoryID: {
    type: String,
    default: () => nanoid(),
  },
  categoryGroupID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CaseCategoryID",
  },
  categoryName: {
    type: String,
  },
  description: {
    type: String,
  },
  dateAdded: {
    type: Date,
    default: Date.now(),
  },
});

const CaseCategory = mongoose.model("CaseCategory", caseCategorySchema);

module.exports = CaseCategory;
