const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

const Schema = mongoose.Schema;

const caseCategoryGroupSchema = new Schema({
  
  // Unique Identifier of the Group on the Platform
  categoryGroupID: {
    type: String,
    default: () => nanoid()
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

  // Date and Time the group was added on the platform
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

const CaseCategoryGroup = mongoose.model("CaseCategoryGroup", caseCategoryGroupSchema);

module.exports = CaseCategoryGroup;
