const jwt = require("jsonwebtoken");

const User = require("../../models/partners/PartnerUser");
const signupValidation = require("../../validations/signup");
const loginValidation = require("../../validations/login");
const {
  validationError,
  tryCatchError,
  normalError,
} = require("../../utils/errorHandlers");
const { successWithData } = require("../../utils/successHandler");

const signToken = (id, userType, role) => {
  return jwt.sign({ id, role, userType }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user._id, user.role, user.userType);
  const data = {
    token,
    user,
  };
  return successWithData(res, statusCode, message, data);
};

exports.signup = async (req, res, next) => {
  const { errors, isValid } = signupValidation(req.body);
  if (!isValid) {
    return normalError(res, 404, "Incomplete Fields", errors);
  }
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
  const { errors, isValid } = loginValidation(req.body);
  if (!isValid) {
    return normalError(res, 404, "Incomplete Fields", errors);
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (
      !user ||
      !(await user.correctPassword(password, user.password))
    ) {
      return validationError(res, "Authentication error");
    }

    createSendToken(user, 200, res, "User Authorized");
  } catch (err) {
    return tryCatchError(res, err);
  }
};
