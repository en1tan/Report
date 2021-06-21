const CaseVictim = require("../../models/cases/CaseVictim");
const Case = require("../../models/cases/Case");
const PublicUser = require("../../models/PublicUser");
const PartnerUser = require("../../models/partners/PartnerUser");
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
    req.body.caseID = req.params.id;
    req.body.addedBy = req.user._id.toString();
    req.body.addedByUserType = req.user.userType
      ? "Partner_User"
      : "Public_User";
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
    let { page = 1, limit = 20 } = req.query;
    const victims = await CaseVictim.find({ caseID: req.params.id })
      .select("firstNameOfVictim lastNameOfVictim middleNameOfVictim")
      .sort("-createdAt")
      .limit(limit * 1)
      .skip(((page < 1 ? 1 : page) - 1) * limit)
      .exec();
    const count = await CaseVictim.countDocuments({
      caseID: req.params.caseID,
    }).exec();
    const data = {
      victims,
      total: Math.ceil(count / limit),
      page: parseInt(page),
    };
    return successWithData(res, 200, "Case victims returned", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.getCaseVictim = async (req, res) => {
  try {
    let victim;
    if (req.user && req.user.userType)
      victim = await CaseVictim.findById(req.params.id);
    else
      victim = await CaseVictim.findById({
        _id: req.params.id,
        addedBy: req.user._id,
      }).select("-addedBy -addedByUserType");
    if (!victim) return normalError(res, 404, "victim not found");
    // Get user type
    const userType = victim.addedByUserType;
    const addedBy = req.user.userType
      ? userType === "Public_User"
        ? await PublicUser.findById(victim.addedBy).select(
            "firstName middleName lastName"
          )
        : await PartnerUser.findById(victim.addedBy).select(
            "firstName middleName lastName"
          )
      : "";
    victim.addedBy = addedBy ? JSON.stringify(addedBy) : "User not found";
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
