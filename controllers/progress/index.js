const Progress = require("../../models/Progress");

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

exports.createProgress = async (req, res, next) => {
  try {
    const newProgress = await Progress.create({
      caseId: req.params.caseId,
      reports: [{ text: req.body.report }],
    });
    const data = {
      progress: newProgress,
    };
    return successWithData(res, 200, "Progress Created Succesfully", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.addProgress = async (req, res, next) => {
  try {
    const progress = await Progress.findOneAndUpdate(
      { _id: req.params.id, caseId: req.params.caseId },
      { $push: { reports: req.body.report } },
      { new: true }
    );
    const data = {
      progress
    };
    return successWithData(res, 201, "Progress Updated Succesfully", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
};
