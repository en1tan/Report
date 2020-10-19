const validator = require("validator");
const _ = require("lodash");

const capitalize = require("../utils/capitalize");

module.exports = signupValidation = (data) => {
  let errors = {};

  if (!validator.isLength(data.firstName, { min: 2, max: 30 })) {
    errors.firstName = "firstName must be between 2 and 30 characters";
  }
  if (!validator.isLength(data.lastName, { min: 2, max: 30 })) {
    errors.lastName = "lastName must be between 2 and 30 characters";
  }
  if (!validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  if (!validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }
  if (!validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = "Passwords must match";
  }

  Object.keys(data).forEach((el) => {
    if (validator.isEmpty(el)) {
      errors[el] = `${capitalize(el)} field is required`;
    }
  });

  return {
    errors,
    isValid: _.isEmpty(errors),
  };
};
