const CaseVictim = require("../../models/cases/CaseVictim");
const Case = require("../../models/cases/Case");
const {
  successWithData,
  successNoData,
} = require("../../utils/successHandler");
const { tryCatchError, normalError } = require("../../utils/errorHandlers");

const _ = require("lodash");

exports.createCaseVictim = async (req, res, next) => {
  try {
    const existingCase = await Case.findById(req.params.id);
    if (!existingCase) return normalError(res, 404, "case not found");
    req.body.caseID = req.params.caseID;
    req.body.addedBy = req.user;
    const newVictim = await CaseVictim.create(req.body);
    return successWithData(
      res,
      201,
      "case victim created",
      _.pick(newVictim, [
        "firstNameOfVictim",
        "lastNameOfVictim",
        "middleNameOfVictim",
        "_id",
        "__v",
      ])
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.getCaseVictims = async (req, res) => {
  try {
    const victims = await CaseVictim.find({ caseID: req.params.caseID }).select(
      "firstName lastName middleName"
    );
    return successWithData(res, 200, "Case victims returned", victims);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.getCaseVictim = async (req, res) => {
  try {
    let victim;
    if (req.user.userType) victim = await CaseVictim.findById(req.params.id);
    else
      victim = await CaseVictim.findById(req.params.id).where(
        "addedBy",
        req.user._id
      );
    if (!victim) return normalError(res, 404, "victim not found");
    return successWithData(res, 200, "fetched victim details", victim);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.updateVictim = async (req, res) => {
  try {
    const victim = await CaseVictim.findById(req.params.id);
    if (!victim) return normalError(res, 404, "victim not found");
    const updatedVictim = await CaseVictim.findByIdAndUpdate(
      victim._id,
      req.body,
      { new: true }
    ).select("firstName lastName middleName");
    return successWithData(
      res,
      200,
      "victim updated successfully",
      updatedVictim
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.deleteVictim = async (req, res) => {
  try {
    const victim = await CaseVictim.findById(req.params.id);
    if (!victim) return normalError(res, 404, "victim not found");
    await CaseVictim.findByIdAndDelete(victim._id);
    return successNoData(res, "victim deleted successfully");
  } catch (err) {
    return tryCatchError(res, err);
  }
};
