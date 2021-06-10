const OtherDetails = require("../../models/cases/CaseOtherDetails");
const OtherDetailsDoc = require("../../models/cases/CaseOtherDetailsDoc");
const Case = require("../../models/cases/Case");

const { tryCatchError, normalError } = require("../../utils/errorHandlers");
const { successWithData } = require("../../utils/successHandler");

/**
 * Create other details
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Express.Response>}
 */
exports.createOtherDetails = async (req, res) => {
  try {
    const existingCase = await Case.findById(req.params.caseID);
    if (!existingCase) return normalError(res, 404, "case not found");
    const otherDetailsData = Object.assign(
      { caseID: req.params.caseID },
      req.body
    );
    const newDetails = await OtherDetails.create(otherDetailsData);
    const data = {
      otherDetails: newDetails,
    };
    return successWithData(
      res,
      200,
      "Your message has been added to the case conversation successfully",
      data
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.uploadOtherDetailsDoc = async (req, res, next) => {
  try {
    const otherDetails = await OtherDetails.findById(req.params.progressId);
    otherDetails.otherDetailsDocs.push(req.body);
    await otherDetails.save();
    const otherDetailsDoc = await OtherDetailsDoc.create(req.body);
    return successWithData(
      res,
      200,
      "Message attachments uploaded successfully",
      otherDetailsDoc
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};
