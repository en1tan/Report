const Joi = require("joi");
const capitalize = require("../utils/capitalize");

const validators = {
  signup: Joi.object({
    firstName: Joi.string().min(2).max(30).required(),
    middleName: Joi.string().optional(),
    lastName: Joi.string().min(2).max(30).required(),
    userName: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().lowercase().required(),
    phoneNumber: Joi.string().required(),
    gender: Joi.string().valid("Male", "Female"),
    address: Joi.string().required(),
    password: Joi.string().min(8).required().strict(),
    userAgeGroup: Joi.string().optional(),
    addressLandmark: Joi.string().optional(),
    lga: Joi.string().optional(),
    state: Joi.string().optional(),
    country: Joi.string().optional(),
    avatar: Joi.string().optional(),
    disabilityStatus: Joi.string().optional(),
    religion: Joi.string().optional(),
  }),
  login: Joi.object({
    userName: Joi.string().lowercase().required(),
    password: Joi.string().min(8).required().strict(),
  }),
  partnerSignup: Joi.object({
    partnerID: Joi.string().optional(),
    branchID: Joi.string().optional(),
    firstName: Joi.string().min(2).max(30).required(),
    lastName: Joi.string().min(2).max(30).required(),
    userName: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().lowercase().required(),
    phoneNumber: Joi.string().required(),
    gender: Joi.string().valid("Male", "Female"),
    address: Joi.string().required(),
    stateOfAssignment: Joi.string().optional(),
    password: Joi.string().min(8).required().strict(),
    confirmPassword: Joi.string()
      .min(8)
      .valid(Joi.ref("password"))
      .required()
      .strict(),
    lga: Joi.string().optional(),
    userType: Joi.string()
      .valid("super-admin", "admin", "verifier", "staff")
      .required(),
  }),
};

module.exports = (validator, property) => async (req, res, next) => {
  const validatorFunc = validators[validator];

  if (!validatorFunc)
    return res.status(500).send({
      status: false,
      statusCode: 500,
      message: "request cannot be validated. please try again",
      data: null,
    });
  const { error } = validatorFunc.validate(req[property]);
  if (error) {
    const { details } = error;
    const message = details.map((err) => err.message).join(",");
    return res.status(400).send({
      status: false,
      statusCode: 400,
      message: capitalize(message.replace(/['"]/g, "")),
      data: null,
    });
  }

  next();
};
