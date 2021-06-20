const CaseComment = require("../../models/cases/CaseComment");
const PublicUser = require("../../models/PublicUser");

const { tryCatchError, normalError } = require("../../utils/errorHandlers");
const {
  successWithData,
  successNoData,
} = require("../../utils/successHandler");

exports.createComment = async (req, res) => {
  try {
    const newComment = await CaseComment.create({
      caseID: req.params.caseId,
      publicUserID: req.user.id,
      comment: req.body.comment,
    });
    const user = await PublicUser.findById(req.user._id);
    const data = {
      comment: newComment.comment,
      dateOfComment: newComment.updatedAt,
      avatar: user.avatar,
      caseID: req.params.caseId,
      userName: user.userName,
    };
    return successWithData(res, 200, "Comment posted successfully", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.readComments = async (req, res, next) => {
  let commenters = [];
  try {
    let { page = 1, limit = 20 } = req.query;
    const comments = await CaseComment.find({
      caseID: req.params.caseID,
    })
      .sort("-createdAt")
      .select("-createdAt")
      .limit(limit * 1)
      .skip((page - 1) * limit);
    for (let i = 0; i < comments.length; i++) {
      const user = await PublicUser.findById(comments[i].publicUserID);
      commenters.push({
        avatar: user.avatar,
        userName: user.userName,
        fullName: `${user.lastName} ${user.firstName} ${user.middleName}`,
        comment: comments[i].comment,
        caseID: req.params.caseID,
        dateOfComment: comments[i].updatedAt,
        _id: comments[i]._id,
        __v: comments[i].__v,
      });
    }
    const count = await CaseComment.countDocuments({
      caseID: req.params.caseID,
    });
    const data = {
      commenters,
      total: Math.ceil(count / limit),
      page: parseInt(page),
    };
    return successWithData(res, 200, "Comments fetched", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.updateComment = async (req, res) => {
  try {
    const comment = await CaseComment.findById(req.params.id)
      .where("publicUserID", req.user._id)
      .where("caseID", req.body.caseID);
    if (!comment) return normalError(res, 404, "comment not found");
    const updatedComment = await CaseComment.findByIdAndUpdate(
      comment._id,
      req.body,
      { new: true }
    ).select("caseID comment");
    return successWithData(res, 200, "comment updated", updatedComment);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await CaseComment.findById(req.params.id).where(
      "publicUserID",
      req.user._id
    );
    if (!comment) return normalError(res, 404, "comment not found");
    await CaseComment.findByIdAndDelete(comment._id);
    return successNoData(res, 200, "comment deleted");
  } catch (err) {
    return tryCatchError(res, err);
  }
};
