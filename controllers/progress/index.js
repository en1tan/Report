const CaseProgress = require("../../models/cases/CaseProgress");
const CaseProgressDoc = require("../../models/cases/CaseProgressDoc");

const {
  tryCatchError,
  normalError,
} = require("../../utils/errorHandlers");
const { successWithData } = require("../../utils/successHandler");
const { uploadDocs } = require("../case/cloudUpload");

exports.createProgress = async (req, res, next) => {
  try {
    const progressData = Object.assign(
      { caseID: req.params.caseId },
      req.body,
    );
    const newProgress = await CaseProgress.create(progressData);
    const data = {
      progress: newProgress,
    };
    return successWithData(
      res,
      200,
      "Progress report has been succesfully added to the case file",
      data,
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.uploadProgressDoc = async (req, res, next) => {
  try {
    const progressImage = await uploadDocs(req.file);
    req.body.URL = progressImage.url;
    const progress = await CaseProgress.findById(
      req.params.progressId,
    );
    if (!progress) return normalError(res, 404, "Progress report not found");
    progress.progressDocs.push(req.body);
    await progress.save();
    const progressDoc = await CaseProgressDoc.create(req.body);
    return successWithData(
      res,
      200,
      "Progress report documents uploaded succesfully",
      progressDoc,
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};
