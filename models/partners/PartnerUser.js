const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  10
);

const Schema = mongoose.Schema;

const partnerUserSchema = new Schema(
  {
    // Unique Identifier of the User
    userID: {
      type: String,
      default: () => nanoid(),
    },

    // ID of the User's Organization
    partnerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
    },

    // ID of the Branch the User is working at
    branchID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },

    // First Name of the User
    firstName: {
      type: String,
      required: [true, "First Name is required"],
    },

    // Last Name of the User
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
    },

    // Middle Name of the User
    middleName: {
      type: String,
    },

    // Unique username of the user and also used to login
    userName: {
      type: String,
      required: [true, "User Name is required"],
    },

    //  Email Address of the User
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
    },

    // Phone number of the staff
    phoneNumber: {
      type: String,
      required: [true, "Please provide the Phone Number"],
    },

    // Date of birth of the staff
    dob: {
      type: Date,
    },

    // Gender of the Staff
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },

    // User Priviliege
    userType: {
      type: String,
      enum: ["super-admin", "admin", "staff", "verifier"],
      default: "staff",
    },

    // Residential Address of Staff
    address: {
      type: String,
      required: true,
    },

    // LGA of the Residential Address
    lga: {
      type: String,
    },

    // State of the Resendential Address
    stateOfAssignment: {
      type: String,
    },

    country: {
      type: String,
    },

    // Link to Profile Picture
    avatar: String,

    // Encrypted Password
    password: {
      type: String,
      required: [true, "Please provide a Password"],
      minlength: 4,
    },

    // Indicator to tell Whether the user is currently using the platform or not
    onlineStatus: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },

    // Account active or disabled
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

partnerUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

partnerUserSchema.methods.correctPassword = async function (
  incomingPassword,
  userPassword
) {
  return await bcrypt.compare(incomingPassword, userPassword);
};

const PartnerUser = mongoose.model("PartnerUser", partnerUserSchema);

module.exports = PartnerUser;
