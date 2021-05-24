const OtherDetails = require("../../models/cases/CaseOtherDetails");
const OtherDetailsDoc = require("../../models/cases/CaseOtherDetailsDoc");

const { tryCatchError } = require("../../utils/errorHandlers");
const { successWithData } = require("../../utils/successHandler");
const { uploadDocs } = require("../case/cloudUpload");

exports.createOtherDetails = async (req, res, next) => {
  try {
    const otherDetailsData = Object.assign(
      { caseID: req.params.caseId },
      req.body,
    );
    const newDetails = await OtherDetails.create(otherDetailsData);
    const data = {
      otherDetails: newDetails,
    };
    return successWithData(
      res,
      200,
      "Other details Created Succesfully",
      data,
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.uploadOtherDetailsDoc = async (req, res, next) => {
  try {
    const otherDetailsImage = await uploadDocs(req.file);
    req.body.URL = otherDetailsImage.url;
    const otherDetails = await OtherDetails.findById(
      req.params.progressId,
    );

    otherDetails.otherDetailsDocs.push(req.body);
    await otherDetails.save();
    const otherDetailsDoc = await OtherDetailsDoc.create(req.body);
    return successWithData(
      res,
      200,
      "Other Details Documents uploaded Succesfully",
      otherDetailsDoc,
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};
