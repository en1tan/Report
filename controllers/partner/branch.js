const PartnerBranch = require("../../models/partners/PartnersBranches");
const Partner = require("../../models/partners/Partners");
const PartnerUser = require("../../models/partners/PartnerUser");

const { tryCatchError, normalError } = require("../../utils/errorHandlers");
const {
  successWithData,
  successNoData,
} = require("../../utils/successHandler");

const _ = require("lodash");

exports.addBranchToPartnerOrganization = async (req, res) => {
  try {
    const partnerOrg = await Partner.findById(req.params.id);
    if (!partnerOrg)
      return normalError(res, 404, "Partner organization not found");
    const branchData = Object.assign(req.body, {
      partnerID: req.params.id,
    });
    const branch = await PartnerBranch.create(branchData);
    return successWithData(
      res,
      201,
      "Partner organization branch created successfully",
      branch
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.listBranches = async (req, res) => {
  try {
    let { page = 1, limit = 20 } = req.query;
    const partner = await Partner.findById(req.params.partnerID);
    if (!partner)
      return normalError(res, 404, "partner organization not found");
    if (req.user.userType !== "super-admin")
      return successWithData(
        res,
        200,
        "branches fetched successfully",
        await PartnerBranch.find({
          partnerID: req.params.partnerID,
          state: req.user.stateOfAssignment,
        })
          .limit(limit * 1)
          .skip(((page < 1 ? 1 : page) - 1) * limit)
          .exec()
      );
    return successWithData(
      res,
      200,
      "branches fetched successfully",
      await PartnerBranch.find({ partnerID: req.params.partnerID })
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.fetchBranch = async (req, res) => {
  try {
    const branch = await PartnerBranch.findById(req.params.id);
    if (!branch) return normalError(res, 404, "branch not found");
    return successWithData(res, 200, "branch fetched successfully", branch);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.updatePartnerBranch = async (req, res) => {
  try {
    const branch = await PartnerBranch.findById(req.params.id);
    if (!branch) return normalError(res, 404, "branch not found");
    const updatedBranch = await PartnerBranch.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return successWithData(res, 200, "branch updated", updatedBranch);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.deleteBranch = async (req, res) => {
  try {
    const branch = await PartnerBranch.findById(req.params.id);
    if (!branch) return normalError(res, 404, "branch not found");
    await PartnerBranch.findByIdAndDelete(branch._id);
    return successNoData(res, 200, "branch deleted successfully");
  } catch (err) {
    return tryCatchError(res, err);
  }
};

// -------- USERS ------------ //
exports.listUsers = async (req, res) => {
  let { page = 1, limit = 20 } = req.query;
  const filter = _.pick(req.query, ["onlineStatus", "userType"]);
  filter.branchID = req.params.id;
  try {
    const branch = await PartnerBranch.findById(req.params.id);
    if (!branch) return normalError(res, 404, "branch not found");
    const users = await PartnerUser.find(filter)
      .where("partnerID", branch.partnerID)
      .select(
        "userID branchID firstName lastName middleName email phoneNumber gender userType stateOfAssignment avatar"
      )
      .sort("-createdAt")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await PartnerUser.find(filter).exec();
    const data = {
      users,
      total: Math.ceil(count / limit),
      page: parseInt(page),
    };
    return successWithData(res, 200, "fetched all users", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
};
