const mongoose = require("mongoose");
const {genIDs} = require("../../utils/genID");
const Schema = mongoose.Schema;

const partnerSchema = new Schema(
  {
    // Unique identifier of Sorosoke partner Organization
    partnerID: {
      type: String,
    },

    // Full Name of Partner Organization
    organizationName: {
      type: String,
      required: [true, "Organisation Name is required"],
    },

    // Organization Contact Email Address
    email: {
      type: String,
      unique: true,
      required: [true, "Contact Email is required"],
      lowercase: true,
    },

    // Organization contact Phone Number
    phoneNumber: {
      type: String,
      required: [true, "Please provide the phone number"],
    },

    // Organization's Office Address
    address: {
      type: String,
      required: true,
    },

    // LGA of the Organization's Office
    lga: {
      type: String,
    },

    // State of the Organization's Office
    state: {
      type: String,
    },

    // Country of the Organization's Office
    country: {
      type: String,
    },

    // Type of Organization
    organizationType: {
      type: String,
      enum: ["Government", "NGO", "Private", "Others"],
    },

    // CAC Registration Number
    regNumber: {
      type: String,
      required: [true, "Please provide the registration number"],
    },

    // About the Organization
    descriptionOfOrg: {
      type: String,
    },
  },
  {timestamps: true},
);

partnerSchema.pre('save', function (next) {
  this.partnerID = genIDs("SPTR");
  next();
})

const Partner = mongoose.model("Partner", partnerSchema);

module.exports = Partner;
