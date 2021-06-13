const CaseProgress = require("../../models/cases/CaseProgress");
const CaseProgressDoc = require("../../models/cases/CaseProgressDoc");
const PartnerUser = require("../../models/partners/PartnerUser");
const Case = require("../../models/cases/Case");
const { tryCatchError, normalError } = require("../../utils/errorHandlers");
const {
  successWithData,
  successNoData,
} = require("../../utils/successHandler");

/**
 * Create case progress
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<CaseProgress>}
 */
exports.createProgress = async (req, res) => {
  try {
    const existingCase = await Case.findById(req.params.caseID);
    if (!existingCase) return normalError(res, 404, "case not found");
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
 * @returns {Promise<CaseProgressDoc>}
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

/**
 * Get current case progress
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<CaseProgress>}
 */
exports.getCurrentProgress = async (req, res) => {
  try {
    let progress = [];
    let privacyStatus = "private";
    // set to public if user is not logged in
    if (!req.user) privacyStatus = "public";
    // set to public if logged-in user is neither the reporter
    // nor an admin
    else if (
      req.user &&
      !(await Case.findOne({ publicUserID: req.user })) &&
      !req.user.userType
    )
      privacyStatus = "public";
    const existingCase = await Case.findById(req.params.caseID);
    if (!existingCase) return normalError(res, 404, "case not found");
    const currentProgress = await CaseProgress.find({
      caseID: existingCase._id,
    })
      .where("privacyStatus", privacyStatus)
      .select("caseID partnerUserID title messageContent progressDocs");
    currentProgress.forEach(async (cp) => {
      cp.partner = await PartnerUser.findById(cp.partnerUserID);
      progress.push(cp);
    });

    return successWithData(res, 200, "current case progress", progress);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

/**
 * Edit case progress
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<CaseProgress>}
 */
exports.editCaseProgress = async (req, res) => {
  try {
    const existingCase = await Case.findById(req.body.caseID);
    if (!existingCase) return normalError(res, 404, "case not found");
    const updatedProgress = await CaseProgress.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select("-publicUserID partnerUserID");
    return successWithData(
      res,
      200,
      "case progress updated successfully",
      updatedProgress
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

/**
 * Delete Progress
 * File or progress
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<successNoData>}
 */
exports.deleteProgress = async (req, res) => {
  try {
    const progress = await CaseProgress.findById(req.params.id);
    if (!progress) return normalError(res, 404, "case progres not found");
    if (req.body.deletionType === "file")
      await CaseProgressDoc.findOne({ progressID: req.params.id });
    else if (req.body.deletionType === "normal")
      await CaseProgress.findByIdAndDelete(progress._id);
    else {
      await CaseProgressDoc.deleteMany({ progressID: progress._id });
      await CaseProgress.findByIdAndDelete(progress._id);
    }
    return successNoData(res, 200, "case progress deleted successfully");
  } catch (err) {
    return tryCatchError(res, err);
  }
};
