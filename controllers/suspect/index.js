const _ = require('lodash');

const Model = require('../../models/cases/CaseSuspect');
const Case = require('../../models/cases/Case');

const {
  tryCatchError,
  normalError
} = require('../../utils/errorHandlers');
const {
  successWithData,
  successNoData
} = require('../../utils/successHandler')

exports.createSuspect = async (req, res) => {
  try {
    const existingCase = await Case.findById(req.params.caseID);
    if (!existingCase) return normalError(res, 404, "case not found");
    req.body.caseID = existingCase._id;
    req.body.addedBy = req.user._id;
    const suspect = await Model.create(req.body);
    return successWithData(
      res,
      201, "suspect created successfully",
      _.pick(suspect,
        [
          "firstNameOfSuspect",
          "lastNameOfSuspect",
          "middleNameOfSuspect",
          "_id",
          "__v"
        ]
      ))
  } catch (err) {
    return tryCatchError
  }
}

exports.getSuspects = async (req, res) => {
  try {
    const existingCase = await Case.findById(req.params.caseID);
    if (!existingCase) return normalError(res, 404, "case not found");
    const suspects = await Model.find({caseID: req.params.id}).select(
      "firstNameOfSuspect" +
      " lastNameOfSuspect" +
      " middleNameOfSuspect"
    )
    return successWithData(res, 200, "fetched all suspects", suspects)
  } catch (err) {
    return tryCatchError(res, err);
  }
}

exports.getSuspect = async (req, res) => {
  try {
    const existingCase = await Case.findById(req.params.caseID);
    if (!existingCase) return normalError(res, 404, "case not found");
    const suspect =
      await Model.findById(req.params.id)
        .where("caseID")
        .in([existingCase._id]);
    return successWithData((res, 200, "suspect fetched", suspect))
  } catch (err) {
    return tryCatchError(res, err)
  }
}

exports.editSuspect = async (req, res) => {
  try {
    const suspect = await Model.findById(req.params.id);
    if (!suspect) return normalError(res, 404, "suspect not found")
      await Model.findByIdAndUpdate(
        suspect._id, req.body,
        {new: true});
    return successNoData(res, 200, "suspect updated successfully");
  } catch (err) {
    return tryCatchError(res, err);
  }
}

exports.deleteSuspect = async (req, res) => {
  try {
    const suspect = await Model.findById(req.params.id);
    if (!suspect) return normalError(res, 404, "suspect not found")
    await Model.findByIdAndDelete(suspect._id);
    return successNoData(res, 200, "suspect deleted successfully")
  } catch (err) {
    return tryCatchError(res, err);
  }
}