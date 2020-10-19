const validator = require("validator");
const _ = require("lodash");

const capitalize = require("../utils/capitalize");

module.exports = loginValidation = (data) => {
  let errors = {};

  if (!validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  Object.keys(data).forEach((el) => {
    if (validator.isEmpty(data[el])) {
      errors[el] = `${capitalize(el)} field is required`;
    }
  });

  return {
    errors,
    isValid: _.isEmpty(errors),
  };
};
