const CaseProgress = require("../../models/cases/CaseProgress");
const CaseProgressDoc = require("../../models/cases/CaseProgressDoc");

const { tryCatchError, normalError } = require("../../utils/errorHandlers");
const { successWithData } = require("../../utils/successHandler");

/**
 * Create case progress
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Express.Response>}
 */
exports.createProgress = async (req, res) => {
  try {
    const progressData = Object.assign({ caseID: req.params.caseID }, req.body);
    const newProgress = await CaseProgress.create(progressData);
    const data = {
      progress: newProgress,
    };
    return successWithData(
      res,
      200,
      "Progress report has been successfully added to the case file",
      data
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

/**
 * Upload Documents to progress
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Express.Response>}
 */
exports.uploadProgressDoc = async (req, res) => {
  try {
    const progress = await CaseProgress.findById(req.params.progressId);
    if (!progress) return normalError(res, 404, "Progress report not found");
    progress.progressDocs.push(req.body);
    await progress.save();
    const progressDoc = await CaseProgressDoc.create(req.body);
    return successWithData(
      res,
      200,
      "Progress report documents uploaded successfully",
      progressDoc
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};
