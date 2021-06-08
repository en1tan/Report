const CaseComment = require("../../models/cases/CaseComment");
const PublicUser = require("../../models/PublicUser");

const { tryCatchError } = require("../../utils/errorHandlers");
const { successWithData } = require("../../utils/successHandler");

exports.createComment = async (req, res, next) => {
  try {
    const newComment = await CaseComment.create({
      caseID: req.params.caseId,
      publicUserID: req.user.id,
      comment: req.body.comment,
    });
    const data = {
      comment: newComment,
    };
    return successWithData(
      res,
      200,
      "Comment posted succesfully",
      data
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.readComments = async (req, res, next) => {
  let commenters = [];
  try {
    const comments = await CaseComment.find({
      caseID: req.params.caseID,
    })
      .sort("-createdAt")
      .select("-createdAt");
    for (let i = 0; i < comments.length; i++) {
      const user = await PublicUser.findById(
        comments[i].publicUserID
      );
      commenters.push({
        avatar: user.avatar,
        userName: user.userName,
        comment: comments[i].comment,
        caseID: comments[i].caseID,
        dateOfComment: comments[i].updatedAt,
        _id: comments[i]._id,
        __v: comments[i].__v,
      });
    }
    return successWithData(res, 200, "Comments fetched", commenters);
  } catch (err) {
    return tryCatchError(res, err);
  }
};
