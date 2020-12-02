const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

const Schema = mongoose.Schema;

const partnerBranchSchema = new Schema({
  branchID: {
    type: String,
    default: () => nanoid()
  },
  partnerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Partner",
  },
  name: {
    type: String,
    required: [true, "First Name is required"],
  },
  address: {
    type: String,
    required: true,
  },
  ward: {
    type: String
  },
  lga: {
    type: String
  },
  state: {
    type: String
  },
  country: {
    type: String
  },
});


const PartnerBranch = mongoose.model("PartnerBranch", partnerBranchSchema);

module.exports = PartnerBranch;
