const Joi = require("joi");
const capitalize = require("../utils/capitalize");

const validators = {
  signup: Joi.object({
    firstName: Joi.string().min(2).max(30).required(),
    middleName: Joi.string().optional(),
    lastName: Joi.string().min(2).max(30).required(),
    userName: Joi.string().min(3).max(20).lowercase().required(),
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
    middleName: Joi.string().min(2).max(30).optional(),
    lastName: Joi.string().min(2).max(30).required(),
    userName: Joi.string().min(3).max(20).lowercase().required(),
    email: Joi.string().email().lowercase().required(),
    phoneNumber: Joi.string().required(),
    gender: Joi.string().valid("Male", "Female"),
    address: Joi.string().required(),
    stateOfAssignment: Joi.string().optional(),
    password: Joi.string().min(8).required().strict(),
    lga: Joi.string().optional(),
    userType: Joi.string()
      .valid("super-admin", "admin", "verifier", "staff")
      .required(),
  }),
  suspect: Joi.object({
    firstNameOfSuspect: Joi.string().min(2).max(30).required(),
    middleNameOfSuspect: Joi.string().min(2).max(30).optional(),
    lastNameOfSuspect: Joi.string().min(2).max(30).required(),
    emailOfSuspect: Joi.string().email().lowercase().optional(),
    phoneNumberOfSuspect: Joi.string().optional(),
    suspectAgeGroup: Joi.string().optional(),
    genderOfSuspect: Joi.string().valid("Male", "Female"),
    guiltStatus: Joi.string().optional(),
    residentialAddressOfSuspect: Joi.string().required(),
    lgaOfSuspect: Joi.string().optional(),
    stateOfSuspect: Joi.string().optional(),
    countryOfSuspect: Joi.string().optional(),
    suspectOccupation: Joi.string().optional(),
    suspectOrganizationType: Joi.string().optional(),
    suspectOrganizationID: Joi.string().optional(),
    suspectOrganizationName: Joi.string().optional(),
    otherDetailsOfSuspect: Joi.string().optional(),
    disabilityStatus: Joi.string().optional(),
    relationshipWithVictim: Joi.string().optional(),
  }),
  victim: Joi.object({
    firstNameOfVictim: Joi.string().min(2).max(30).required(),
    middleNameOfVictim: Joi.string().min(2).max(30).optional(),
    lastNameOfVictim: Joi.string().min(2).max(30).required(),
    emailOfVictim: Joi.string().email().lowercase().optional(),
    phoneNumberOfVictim: Joi.string().optional(),
    victimAgeGroup: Joi.string().optional(),
    genderOfVictim: Joi.string().valid("Male", "Female"),
    residentialAddressOfVictim: Joi.string().required(),
    lgaOfVictim: Joi.string().optional(),
    stateOfVictim: Joi.string().optional(),
    countryOfVictim: Joi.string().optional(),
    victimOccupation: Joi.string().optional(),
    victimOrganizationType: Joi.string().optional(),
    victimOrganizationID: Joi.string().optional(),
    victimOrganizationName: Joi.string().optional(),
    otherDetailsOfVictim: Joi.string().optional(),
    disabilityStatus: Joi.string().optional(),
    relationshipWithVictim: Joi.string().optional(),
  }),
  witness: Joi.object({
    firstNameOfWitness: Joi.string().min(2).max(30).required(),
    middleNameOfWitness: Joi.string().min(2).max(30).optional(),
    lastNameOfWitness: Joi.string().min(2).max(30).required(),
    emailOfWitness: Joi.string().email().lowercase().optional(),
    phoneNumberOfWitness: Joi.string().optional(),
    witnessAgeGroup: Joi.string().optional(),
    genderOfWitness: Joi.string().valid("Male", "Female"),
    residentialAddressOfWitness: Joi.string().required(),
    lgaOfWitness: Joi.string().optional(),
    stateOfWitness: Joi.string().optional(),
    countryOfWitness: Joi.string().optional(),
    witnessOccupation: Joi.string().optional(),
    witnessOrganizationType: Joi.string().optional(),
    witnessOrganizationID: Joi.string().optional(),
    witnessOrganizationName: Joi.string().optional(),
    otherDetailsOfWitness: Joi.string().optional(),
    disabilityStatus: Joi.string().optional(),
    relationshipWithVictim: Joi.string().optional(),
  }),
  case: Joi.object({
    caseAvatar: Joi.string().optional(),
    categoryGroupID: Joi.string().required(),
    categories: Joi.string().required(),
    addressOfIncident: Joi.string().optional(),
    addressLandmark: Joi.string().optional(),
    hourOfIncident: Joi.string().optional(),
    dateOfIncident: Joi.string().optional(),
    country: Joi.string().optional(),
    state: Joi.string().optional(),
    lga: Joi.string().optional(),
    descriptionOfIncident: Joi.string().optional(),
    areYouTheVictim: Joi.string().valid("Yes","No").required(),
    reportType: Joi.string().valid("Standard","QuickReport").required(),
    casePleas: Joi.string().optional(),
    platformOfReport: Joi.string().valid("mobile","web","sms").optional()
  }),
  contact: Joi.object({
    senderName: Joi.string().min(2).max(50).optional(),
    phoneNumber: Joi.string().optional(),
    email: Joi.string().email().required(),
    subject: Joi.string().required(),
    message: Joi.string().required(),
  }),
};

/**
 * Validate request
 * @param {string} validator
 * @param {string} property
 * @returns {(function(*, *, *): Promise<*|undefined>)|*}
 */
module.exports = (validator, property) => async (req, res, next) => {
  const validatorFunc = validators[validator];

  if (!validatorFunc)
    return res.status(500).send({
      status: false,
      statusCode: 500,
      message: "Request cannot be validated. Please try again",
      data: null,
    });
  const { error } = validatorFunc.validate(req[property]);
  if (error) {
    const { details } = error;
    const message = details.map((err) => err.message).join(",");
    return res.status(400).send({
      status: false,
      statusCode: 400,
      message: message.replace(/['"]/g, ""),
      data: null,
    });
  }

  next();
};
