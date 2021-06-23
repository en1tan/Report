const OtherDetails = require("../../models/cases/CaseOtherDetails");
const OtherDetailsDoc = require("../../models/cases/CaseOtherDetailsDoc");
const Case = require("../../models/cases/Case");

const { tryCatchError, normalError } = require("../../utils/errorHandlers");
const {
  successWithData,
  successNoData,
} = require("../../utils/successHandler");

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
    req.body.caseID = existingCase._id;
    const newDetails = await OtherDetails.create({
      caseID: existingCase._id,
      from: req.body.from,
      userID: req.user._id,
      message: req.body.message,
    });
    for (let d = 0; d < req.body.docs.length; d++)
      await OtherDetailsDoc.create({
        caseOtherDetailsID: newDetails._id,
        URL: req.body.docs[d].URL,
        docTitle: req.body.docs[d].docTitle,
      });
    const docs = await OtherDetailsDoc.find({
      caseOtherDetailsID: newDetails._id,
    });
    const data = {
      conversation: newDetails,
      docs,
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

exports.fetchAllConversations = async (req, res) => {
  try {
    let conversations = [];
    const { page = 1, limit = 5 } = req.query;
    console.log(req.params);
    const existingCase = await Case.findById(req.params.caseID);
    if (!existingCase) return normalError(res, 404, "case not found");
    const otherDetails = await OtherDetails.find({ caseID: existingCase._id })
      .limit(limit * 1)
      .skip(((page > 1 ? 1 : page) - 1) * limit);
    for (let i = 0; i < otherDetails.length; i++) {
      const docs = await OtherDetailsDoc.find({
        caseOtherDetailsID: otherDetails[i]._id,
      });
      conversations.push({ details: otherDetails[i], docs });
    }
    const count = await OtherDetails.countDocuments({
      caseID: existingCase._id,
    });
    const data = {
      conversations,
      total: Math.ceil(count / limit),
      page: parseInt(page),
    };
    return successWithData(
      res,
      200,
      "other details conversation returned",
      data
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.fetchConversation = async (req, res) => {
  try {
    const conversation = await OtherDetails.findById(req.params.id);
    if (!conversation) return normalError(res, 404, "conversation not found");
    const conversationDocs = await OtherDetailsDoc.findOne({
      caseOtherDetailsID: conversation._id,
    });
    const data = Object.assign(conversation, conversationDocs);
    return successWithData(res, 200, "fetched conversation", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.deleteConversation = async (req, res) => {
  try {
    const conversation = await OtherDetails.findById(req.params.id);
    if (!conversation) return normalError(res, 404, "conversation not found");
    await OtherDetailsDoc.findOneAndDelete({
      caseOtherDetailsID: conversation._id,
    });
    await OtherDetails.findByIdAndDelete(conversation._id);
    return successNoData(res, 200, "conversation deleted successfully");
  } catch (err) {
    return tryCatchError(res, err);
  }
};
