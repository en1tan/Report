const mongoose = require("mongoose");
const {genIDs} = require("../utils/genID");
const Schema = mongoose.Schema;

const publicUserSchema = new Schema(
  {
    //Public User ID
    userID:{
      type: String
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
      required: true,
      unique: true,
      immutable: true,
    },

    // Email Address of the User
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
    },

    // Phone contact of the user: used to recieve notificationa and retrieve password via OTP
    phoneNumber: {
      type: String,
      required: [true, "Please provide your phone number"],
    },

    // Age group of victim- 0-5, 6-11, 12-17, 18 - above
    userAgeGroup: {
      type: String,
    },

    // Gender of the user
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },

    // Address of the User's residence
    address: {
      type: String,
      required: true,
    },

    // Areas Close to the address to help locate it faster
    addressLandmark: {
      type: String,
    },

    // LGA of the User's residence
    lga: {
      type: String,
    },

    // State of the User's residence
    state: {
      type: String,
    },

    // Country of the User's residence
    country: {
      type: String,
    },

    // Profile picture link
    avatar: {
      type: String,
    },

    // Encrypted password of the User
    password: {
      type: String,
      required: [true, "Please provide a Password"],
      minlength: 8,
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

    // If the user has any disabilities
    disabilityStatus: String,

    // Religious oreintation of the user
    religion: String,
  },
  { timestamps: true }
);

publicUserSchema.pre("save", async function (next) {
  this.userID=genIDs("SUSR");
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

publicUserSchema.methods.correctPassword = async function (
  incomingPassword,
  userPassword
) {
  return await bcrypt.compare(incomingPassword, userPassword);
};

const PublicUser = mongoose.model("PublicUser", publicUserSchema);

module.exports = PublicUser;
