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
    req.body.caseID = existingCase._id;
    const newProgress = await CaseProgress.create({
      caseID: existingCase._id,
      publicUserID: existingCase.publicUserID,
      partnerUserID: req.user._id,
      title: req.body.title,
      messageContent: req.body.messageContent,
      privacyStatus: req.body.privacyStatus,
    });
    for (let i = 0; i < req.body.docs.length; i++)
      await CaseProgressDoc.create({
        caseProgressID: newProgress._id,
        docTitle: req.body.docs[i].docTitle,
        URL: req.body.docs[i].URL,
      });
    const docs = await CaseProgressDoc.find({
      caseProgressID: newProgress._id,
    });
    const data = {
      progress: newProgress,
      docs,
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
 * Get current case progress
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<CaseProgress>}
 */
exports.getCurrentProgress = async (req, res) => {
  try {
    let { page = 1, limit = 20 } = req.query;
    let progress = [];
    let privacyStatus = [];
    // set to public if user is not logged in
    // set to public if logged-in user is neither the reporter
    // nor an admin
    privacyStatus = req.user
      ? !req.user.userType &&
        !(await CaseProgress.findOne({ publicUserID: req.user._id }))
        ? ["public"]
        : ["public", "private"]
      : ["public"];
    const selectedFields = req.user
      ? !req.user.userType &&
        !(await CaseProgress.findOne({ publicUserID: req.user._id }))
        ? "title messageContent updatedAt"
        : "title messageContent publicUserID privacyStatus updatedAt"
      : "title messageContent updatedAt";
    const existingCase = await Case.findById(req.params.caseID);
    if (!existingCase) return normalError(res, 404, "case not found");
    const currentProgress = await CaseProgress.find({
      caseID: existingCase._id,
    })
      .where("privacyStatus")
      .in(privacyStatus)
      .select(selectedFields)
      .limit(limit * 1)
      .skip(((page < 1 ? 1 : page) - 1) * limit)
      .exec();
    for (let i = 0; i < currentProgress.length; i++) {
      const docs = await CaseProgressDoc.find({
        caseProgressID: currentProgress[i]._id,
      });
      const partner = await PartnerUser.findById(
        existingCase.assignedPartnerUserID
      ).select("avatar userName");
      progress.push({ currentProgress: currentProgress[i], docs, partner });
    }
    const count = await CaseProgress.countDocuments({
      caseID: existingCase._id,
    })
      .where("privacyStatus")
      .in(privacyStatus);
    const data = {
      progress,
      total: Math.ceil(count / limit),
      page: parseInt(page),
    };
    return successWithData(res, 200, "current case progress", data);
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
    if (!progress) return normalError(res, 404, "case progress not found");
    if (req.body.deletionType === "file")
      await CaseProgressDoc.findOneAndDelete({ progressID: req.params.id });
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
