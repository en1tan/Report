const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

const Schema = mongoose.Schema;

const publicUserSchema = new Schema({
  userID: {
    type: String,
    default: () => nanoid()
  },
  firstName: {
    type: String,
    required: [true, "First Name is required"],
  },
  lastName: {
    type: String,
    required: [true, "First Name is required"],
  },
  middleName: {
    type: String,
    required: [true, "First Name is required"],
  },
  userName: {
    type: String,
    required: [true, "First Name is required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    lowercase: true,
  },
  phoneNumber: {
    type: String,
    required: [true, "Please provide your phone number"],
  },
  dob: {
    type: Date,
    required: [true, "Please provide your phone number"],
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "other"],
    default: "other"
  },
  userType: {
    type: String,
    enum: ["super-admin", "admin", "user"],
    default: "user",
  },
  address: {
    type: String,
    required: true,
  },
  lga: {
    type: String
  },
  state: {
    type: String
  },
  avatar: String,
  password: {
    type: String,
    required: [true, "Please provide a pasword"],
    minlength: 4,
  },
  onlineStatus: {
    type: String,
    enum: ["online", "offline"],
    default: "offline",
  },
  active: {
    type: Boolean,
    default: true,
  },
});

publicUserSchema.pre("save", async function (next) {
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
