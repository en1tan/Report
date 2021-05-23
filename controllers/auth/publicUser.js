const jwt = require("jsonwebtoken");

const User = require("../../models/PublicUser");
const {
  tryCatchError,
  normalError,
  authorizationError,
} = require("../../utils/errorHandlers");
const { successWithData } = require("../../utils/successHandler");

const signToken = (id, userType) => {
  return jwt.sign({ id, userType }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user._id, user.userType);
  const data = {
    token,
    user,
  };
  return successWithData(res, statusCode, message, data);
};

exports.signup = async (req, res, next) => {
  let errors = {};
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      errors.email = "Email already exists";
      return normalError(res, 400, "Unable to create user", errors);
    }
    const newUser = await User.create({
      ...req.body,
    });
    createSendToken(newUser, 201, res, "User succesfully created");
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (
      !user ||
      !(await user.correctPassword(password, user.password))
    ) {
      return authorizationError(
        res,
        "email or password is incorrrect",
      );
    }
    await User.findByIdAndUpdate(
      user._id,
      { onlineStatus: "online" },
      { new: true },
    );
    createSendToken(user, 200, res, "User Authorized");
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.profile = async (req, res, next) => {
  return successWithData(res, 200, "User details", req.user);
};

exports.editAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return validationError(res, "Authentication error");
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      req.body,
      { new: true },
    );
    return successWithData(
      res,
      200,
      "User updated successfully",
      updatedUser,
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};
