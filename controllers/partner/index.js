const Partner = require("../../models/partners/Partners");
const PartnerUser = require("../../models/partners/PartnerUser");
const { tryCatchError, normalError } = require("../../utils/errorHandlers");
const {
  successWithData,
  successNoData,
} = require("../../utils/successHandler");

exports.getAllStaff = async (req, res, next) => {
  let { page = 1, limit = 20 } = req.query;
  const filter = { partnerID: req.params.id };
  try {
    if (!(await Partner.findById(req.params.id)))
      return normalError(res, 404, "Partner organization does not exist");
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
    if (!staff) return normalError(res, 404, "Partner user data not found");
    const updatedStaff = await PartnerUser.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return successWithData(
      res,
      200,
      "Partner user records updated successfully.",
      updatedStaff
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.deleteStaff = async (req, res, next) => {
  try {
    const staff = await PartnerUser.findById(req.params.id);
    if (!staff) return normalError(res, 404, "Partner user data not found");
    await PartnerUser.findByIdAndUpdate(req.params.id, {
      active: false,
    });
    return successNoData(res, 200, "Partner user record deleted successfully.");
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.getAllPartners = async (req, res, next) => {
  let { page = 1, limit = 20 } = req.query;
  try {
    const partners = await Partner.find()
      .limit(limit * 1)
      .skip(((page < 1 ? 1 : page) - 1) * limit)
      .sort("-createdAt")
      .exec();
    const count = await Partner.countDocuments();
    const data = {
      partners,
      total: Math.ceil(count / limit),
      page: parseInt(page),
    };
    return successWithData(res, 200, "Fetched all partner organizations", data);
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
      "Partner organization created successfully",
      partnerOrg
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.getSinglePartnerOrganization = async (req, res) => {
  try {
    const partnerOrg = await Partner.findById(req.params.id);
    if (!partnerOrg)
      return normalError(res, 404, "partner organization not found");
    return successWithData(
      res,
      200,
      "partner organization fetched successfully",
      partnerOrg
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.updatePartnerOrganization = async (req, res) => {
  try {
    const partnerOrg = await Partner.findById(req.params.id);
    if (!partnerOrg)
      return normalError(res, 404, "partner organization not found");
    const updatedOrg = await Partner.findOneAndUpdate(
      partnerOrg._id,
      req.body,
      { new: true }
    );
    return successWithData(
      res,
      200,
      "partner organization updated successfully",
      updatedOrg
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.deletePartnerOrganization = async (req, res) => {
  try {
    const partnerOrg = await Partner.findById(req.params.id);
    if (!partnerOrg)
      return normalError(res, 404, "partner organization not found");
    await Partner.findByIdAndDelete(partnerOrg._id);
    return successNoData(res, 200, "partner organization deleted successfully");
  } catch (err) {
    return tryCatchError(res, err);
  }
};
