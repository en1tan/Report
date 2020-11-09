const Progress = require("../../models/Comment");

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

exports.createComment = async (req, res, next) => {
  try {
    const newComment = await Progress.create({
      caseId: req.params.caseId,
      userId: req.user.id,
      comment: req.body.comment
    });
    const data = {
      comment: newComment,
    };
    return successWithData(res, 200, "Comment Created Succesfully", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
};