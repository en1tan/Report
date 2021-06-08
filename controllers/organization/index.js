const Organization = require("../../models/Organization");

const ApiFeatures = require("../../utils/apiFeatures");
const {
  validationError,
  tryCatchError,
  normalError,
} = require("../../utils/errorHandlers");
const {
  successWithData,
  successNoData,
} = require("../../utils/successHandler");

exports.createOrganization = async (req, res, next) => {
  try {
    const newOrganization = await Organization.create({
      ...req.body,
    });
    const data = {
      organization: newOrganization,
    };
    return successWithData(
      res,
      200,
      "Organization profile created succesfully",
      data,
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};
