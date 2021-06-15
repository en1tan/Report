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
    const newDetails = await OtherDetails.create(req.body);
    return successWithData(
      res,
      200,
      "Your message has been added to the case conversation successfully",
      newDetails
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.uploadOtherDetailsDoc = async (req, res) => {
  try {
    const otherDetails = await OtherDetails.findById(req.params.otherDetailsID);
    req.body.caseOtherDetailsID = otherDetails._id;
    const otherDetailsDoc = await OtherDetailsDoc.create(req.body);
    return successWithData(
      res,
      200,
      "Message attachments uploaded successfully",
      otherDetailsDoc
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.fetchAllConversations = async (req, res) => {
  try {
    const existingCase = await Case.findById(req.params.caseID);
    if (!existingCase) return normalError(res, 404, "case not found");
    const otherDetails = await OtherDetails.find({ caseID: existingCase._id });
    return successWithData(
      res,
      200,
      "other details conversation returned",
      otherDetails
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
