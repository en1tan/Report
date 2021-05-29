const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  10
);

const Schema = mongoose.Schema;

const partnerBranchSchema = new Schema(
  {
    // Unique Identifier of Branch
    branchID: {
      type: String,
      default: () => nanoid(),
    },

    // ID of the Parent Organization
    partnerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
    },

    // Branch Name of the Organization
    branchName: {
      type: String,
      required: [true, "Branch Name is required"],
    },

    // Address of the Branch
    address: {
      type: String,
      required: true,
    },

    // Ward of the Branch
    ward: {
      type: String,
    },

    // LGA of the Branch
    lga: {
      type: String,
    },

    // State of the Branch
    state: {
      type: String,
    },

    // Country of Branch
    country: {
      type: String,
    },
  },
  { timestamps: true }
);

const PartnerBranch = mongoose.model(
  "PartnerBranch",
  partnerBranchSchema
);

module.exports = PartnerBranch;
