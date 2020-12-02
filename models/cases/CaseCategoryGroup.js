const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

const Schema = mongoose.Schema;

const caseCategoryGroupSchema = new Schema({
  categoryGroupID: {
    type: String,
    default: () => nanoid()
  },
  groupName: {
    type: String,
    required: [true, "Group Name is required"],
  },
  description: {
    type: String,
  },
  dateAdded: {
      type: Date,
      default: Date.now()
  }
});

const CaseCategoryGroup = mongoose.model("CaseCategoryGroup", caseCategoryGroupSchema);

module.exports = CaseCategoryGroup;
