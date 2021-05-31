const Partner = require("../../models/partners/Partners");
const PartnerBranch = require("../../models/partners/PartnersBranches");
const PartnerUser = require("../../models/partners/PartnerUser");
const {
  tryCatchError,
  normalError,
} = require("../../utils/errorHandlers");
const {
  successWithData,
  successNoData,
} = require("../../utils/successHandler");

exports.getAllStaff = async (req, res, next) => {
  let { page = 1, limit = 20 } = req.query;
  filter = { partnerID: req.params.id };
  try {
    if (!(await Partner.findById(req.params.id)))
      return normalError(
        res,
        404,
        "partner organization does not exist"
      );
    const staffs = await PartnerUser.find(filter)
      .sort("-createdAt")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await PartnerUser.countDocuments(filter).exec();
    const data = {
      staffs,
      total: Math.ceil(count / limit),
      page: parseInt(page),
    };
    return successWithData(res, 200, "All staff returned", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.editStaff = async (req, res, next) => {
  try {
    const staff = await PartnerUser.findById(req.params.id);
    if (!staff)
      return normalError(res, 404, "partner user data not found");
    const updatedStaff = await PartnerUser.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return successWithData(
      res,
      200,
      "partner user updated successfully.",
      updatedStaff
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.deleteStaff = async (req, res, next) => {
  try {
    const staff = await PartnerUser.findById(req.params.id);
    if (!staff)
      return normalError(res, 404, "partner user data not found");
    await PartnerUser.findByIdAndUpdate(req.params.id, {
      active: false,
    });
    return successNoData(
      res,
      200,
      "partner user deleted successfully."
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.getAllPartners = async (req, res, next) => {
  let { page = 1, limit = 20 } = req.query;
  try {
    const partners = await Partner.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort("-createdAt")
      .exec();
    const count = await Partner.countDocuments();
    const data = {
      partners,
      total: Math.ceil(count / limit),
      page: parseInt(page),
    };
    return successWithData(
      res,
      200,
      "fetched all partner organizations",
      data
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.createPartnerOrganization = async (req, res, next) => {
  try {
    if (await Partner.find({ email: req.body.email }))
      return normalError(res, 404, "Partner organization exists");
    const partnerOrg = await Partner.create(req.body);
    return successWithData(
      res,
      201,
      "partner organization created",
      partnerOrg
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.addBranchToPartnerOrganization = async (req, res, next) => {
  try {
    const partnerOrg = await Partner.findById(req.params.id);
    if (!partnerOrg)
      return normalError(res, 404, "partner organization not found");
    const branchData = Object.assign(req.body, {
      partnerID: req.params.id,
    });
    const branch = await PartnerBranch.create(branchData);
    return successWithData(
      res,
      201,
      "branch created successfully",
      branch
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};
