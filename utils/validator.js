const Joi = require("joi");
const capitalize = require("../utils/capitalize");

const validators = {
  signup: Joi.object({
    firstName: Joi.string().min(2).max(30).required(),
    middleName: Joi.string().min(2).max(30).optional(),
    lastName: Joi.string().min(2).max(30).required(),
    userName: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().lowercase().required(),
    phoneNumber: Joi.string().required(),
    gender: Joi.string().valid("Male", "Female"),
    address: Joi.string().required(),
    password: Joi.string().min(8).required().strict(),
    confirmPassword: Joi.string()
      .min(8)
      .valid(Joi.ref("password"))
      .required()
      .strict(),
    addressLandmark: Joi.string(),
    lga: Joi.string(),
    state: Joi.string(),
    userAgegroup: Joi.string(),
    country: Joi.string(),
    avatar: Joi.string(),
    disabilityStatus: Joi.string(),
    religion: Joi.string(),
  }),
  login: Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).required().strict(),
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