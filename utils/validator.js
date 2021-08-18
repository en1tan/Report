const Joi = require('joi');

const validators = {
  signup: Joi.object({
    firstName: Joi.string().min(2).max(30).required(),
    middleName: Joi.string().optional().allow(null, ''),
    lastName: Joi.string().min(2).max(30).required(),
    userName: Joi.string().min(3).max(20).lowercase().required(),
    email: Joi.string().email().lowercase().required(),
    phoneNumber: Joi.string().required(),
    gender: Joi.string().valid('Male', 'Female'),
    address: Joi.string().required(),
    password: Joi.string().min(8).required().strict(),
    userAgeGroup: Joi.string().optional().allow(null, ''),
    addressLandmark: Joi.string().optional().allow(null, ''),
    lga: Joi.string().optional().allow(null, ''),
    state: Joi.string().optional().allow(null, ''),
    country: Joi.string().optional().allow(null, ''),
    avatar: Joi.string().optional().allow(null, ''),
    disabilityStatus: Joi.string().optional().allow(null, ''),
    religion: Joi.string().optional(),
  }),
  login: Joi.object({
    userName: Joi.string().lowercase().required(),
    password: Joi.string().min(8).required().strict(),
  }),
  partnerSignup: Joi.object({
    partnerID: Joi.string().optional().allow(null, ''),
    branchID: Joi.string().optional().allow(null, ''),
    firstName: Joi.string().min(2).max(30).required(),
    middleName: Joi.string().min(2).max(30).optional().allow(null, ''),
    lastName: Joi.string().min(2).max(30).required(),
    userName: Joi.string().min(3).max(20).lowercase().required(),
    email: Joi.string().email().lowercase().required(),
    phoneNumber: Joi.string().required(),
    gender: Joi.string().valid('Male', 'Female'),
    address: Joi.string().required(),
    stateOfAssignment: Joi.string().optional().allow(null, ''),
    password: Joi.string().min(8).required().strict(),
    lga: Joi.string().optional().allow(null, ''),
    userType: Joi.string()
      .valid('super-admin', 'admin', 'verifier', 'staff')
      .required(),
  }),
  suspect: Joi.object({
    firstNameOfSuspect: Joi.string().min(2).max(30).required(),
    middleNameOfSuspect: Joi.string().min(2).max(30).optional().allow(null, ''),
    lastNameOfSuspect: Joi.string().min(2).max(30).required(),
    emailOfSuspect: Joi.string().email().lowercase().optional().allow(null, ''),
    phoneNumberOfSuspect: Joi.string().optional().allow(null, ''),
    suspectAgeGroup: Joi.string().optional().allow(null, ''),
    genderOfSuspect: Joi.string().valid('Male', 'Female'),
    guiltStatus: Joi.string().optional().allow(null, ''),
    residentialAddressOfSuspect: Joi.string().required(),
    lgaOfSuspect: Joi.string().optional().allow(null, ''),
    stateOfSuspect: Joi.string().optional().allow(null, ''),
    countryOfSuspect: Joi.string().optional().allow(null, ''),
    suspectOccupation: Joi.string().optional().allow(null, ''),
    suspectOrganizationType: Joi.string().optional().allow(null, ''),
    suspectOrganizationID: Joi.string().optional().allow(null, ''),
    suspectOrganizationName: Joi.string().optional().allow(null, ''),
    otherDetailsOfSuspect: Joi.string().optional().allow(null, ''),
    disabilityStatus: Joi.string().optional().allow(null, ''),
    relationshipWithVictim: Joi.string().optional().allow(null, ''),
    addressLandmark: Joi.string().optional().allow(null, ''),
    religion: Joi.string().optional().allow(null, ''),
  }),
  victim: Joi.object({
    firstNameOfVictim: Joi.string().min(2).max(30).required(),
    middleNameOfVictim: Joi.string().min(2).max(30).optional().allow(null, ''),
    lastNameOfVictim: Joi.string().min(2).max(30).required(),
    emailOfVictim: Joi.string().email().lowercase().optional().allow(null, ''),
    phoneNumberOfVictim: Joi.string().optional().allow(null, ''),
    victimAgeGroup: Joi.string().optional().allow(null, ''),
    genderOfVictim: Joi.string().valid('Male', 'Female'),
    residentialAddressOfVictim: Joi.string().required(),
    lgaOfVictim: Joi.string().optional().allow(null, ''),
    stateOfVictim: Joi.string().optional().allow(null, ''),
    countryOfVictim: Joi.string().optional().allow(null, ''),
    victimOccupation: Joi.string().optional().allow(null, ''),
    victimOrganizationType: Joi.string().optional().allow(null, ''),
    victimOrganizationID: Joi.string().optional().allow(null, ''),
    victimOrganizationName: Joi.string().optional().allow(null, ''),
    otherDetailsOfVictim: Joi.string().optional().allow(null, ''),
    disabilityStatus: Joi.string().optional().allow(null, ''),
    relationshipWithVictim: Joi.string().optional().allow(null, ''),
    addressLandmark: Joi.string().optional().allow(null, ''),
    religion: Joi.string().optional().allow(null, ''),
  }),
  witness: Joi.object({
    firstNameOfWitness: Joi.string().min(2).max(30).required(),
    middleNameOfWitness: Joi.string().min(2).max(30).optional().allow(null, ''),
    lastNameOfWitness: Joi.string().min(2).max(30).required(),
    emailOfWitness: Joi.string().email().lowercase().optional().allow(null, ''),
    phoneNumberOfWitness: Joi.string().optional().allow(null, ''),
    witnessAgeGroup: Joi.string().optional().allow(null, ''),
    genderOfWitness: Joi.string().valid('Male', 'Female'),
    residentialAddressOfWitness: Joi.string().required(),
    lgaOfWitness: Joi.string().optional().allow(null, ''),
    stateOfWitness: Joi.string().optional().allow(null, ''),
    countryOfWitness: Joi.string().optional().allow(null, ''),
    witnessOccupation: Joi.string().optional().allow(null, ''),
    witnessOrganizationType: Joi.string().optional().allow(null, ''),
    witnessOrganizationID: Joi.string().optional().allow(null, ''),
    witnessOrganizationName: Joi.string().optional().allow(null, ''),
    otherDetailsOfWitness: Joi.string().optional().allow(null, ''),
    disabilityStatus: Joi.string().optional().allow(null, ''),
    relationshipWithVictim: Joi.string().optional().allow(null, ''),
    addressLandmark: Joi.string().optional().allow(null, ''),
    religion: Joi.string().optional().allow(null, ''),
  }),
  case: Joi.object({
    caseAvatar: Joi.string().optional().allow(null, ''),
    categoryGroupID: Joi.string().required(),
    categories: Joi.string().required(),
    addressOfIncident: Joi.string().optional().allow(null, ''),
    addressLandmark: Joi.string().optional().allow(null, ''),
    hourOfIncident: Joi.string().optional().allow(null, ''),
    dateOfIncident: Joi.string().optional().allow(null, ''),
    country: Joi.string().optional().allow(null, ''),
    state: Joi.string().optional().allow(null, ''),
    lga: Joi.string().optional().allow(null, ''),
    descriptionOfIncident: Joi.string().optional().allow(null, ''),
    areYouTheVictim: Joi.string().valid('Yes', 'No').required(),
    reportType: Joi.string().valid('Standard', 'QuickReport').required(),
    casePleas: Joi.string().optional().allow(null, ''),
    religion: Joi.string().optional().allow(null, ''),
    platformOfReport: Joi.string()
      .valid('mobile', 'web', 'sms')
      .optional()
      .allow(null, ''),
  }),
  contact: Joi.object({
    senderName: Joi.string().min(2).max(50).optional().allow(null, ''),
    phoneNumber: Joi.string().optional().allow(null, ''),
    email: Joi.string().email().required(),
    subject: Joi.string().required(),
    message: Joi.string().required(),
  }),
  publishCase: Joi.object({
    caseSummary: Joi.string().required(),
    publishStatus: Joi.string().valid('published', 'unpublish').required(),
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
      message: 'Request cannot be validated. Please try again',
      data: null,
    });
  const { error } = validatorFunc.validate(req[property]);
  if (error) {
    const { details } = error;
    const message = details.map((err) => err.message).join(',');
    return res.status(400).send({
      status: false,
      statusCode: 400,
      message: message.replace(/['"]/g, ''),
      data: null,
    });
  }

  next();
};
