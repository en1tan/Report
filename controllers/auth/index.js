const jwt = require('jsonwebtoken');

const User = require('../../models/User');
const signupValidation = require('../../validations/signup');
const loginValidation = require('../../validations/login');
const {
  validationError,
  tryCatchError,
  normalError,
} = require('../../utils/errorHandlers');
const {successWithData} = require('../../utils/successHandler');

const signToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user._id);
  const data = {
    token,
    user,
  };
  return successWithData(res, statusCode, message, data);
};

exports.signup = async (req, res, next) => {
  const {errors, isValid} = signupValidation(req.body);
  if (!isValid) {
    return normalError(res, 404, 'Incomplete Fields', errors);
  }
  const {firstName, lastName, email, password, phoneNumber, userType} =
    req.body;
  try {
    const user = await User.findOne({email});
    if (user) {
      errors.email = 'Email already exists';
      return normalError(res, 400, 'Unable to create user', errors);
    }
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      userType,
    });
    createSendToken(newUser, 201, res, 'User created succesfully');
  } catch (err) {
    return tryCatchError(res, err);
  }
};
