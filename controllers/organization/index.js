const Organization = require("../../models/Organization");
const { tryCatchError, normalError } = require("../../utils/errorHandlers");
const {
  successWithData,
  successNoData,
} = require("../../utils/successHandler");

exports.createOrganization = async (req, res, next) => {
  try {
    const newOrganization = await Organization.create({
      ...req.body,
    });
    const data = {
      organization: newOrganization,
    };
    return successWithData(
      res,
      200,
      "Organization profile created successfully",
      newOrganization
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.getAllOrganizations = async (req, res) => {
  try {
    let { page = 1, limit = 20 } = req.query;
    const organizations = await Organization.find()
      .sort("-createdAt")
      .limit(limit * 1)
      .skip(((page < 1 ? 1 : page) - 1) * limit);
    const count = await Organization.countDocuments();
    const data = {
      organizations,
      total: Math.ceil(count / limit),
      page: parseInt(page),
    };
    return successWithData(res, 200, "organizations returned", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.getOneOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);
    if (!organization) return normalError(res, 404, "organization not found");
    return successWithData(res, 200, "organization fetched", organization);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.updateOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);
    if (!organization) return normalError(res, 404, "organization not found");
    const updatedOrganization = await Organization.findByIdAndUpdate(
      organization._id,
      req.body,
      { new: true }
    );
    return successWithData(
      res,
      200,
      "organization updated",
      updatedOrganization
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.deleteOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);
    if (!organization) return normalError(res, 404, "organization not found");
    await Organization.findByIdAndDelete(organization._id);
    return successNoData(res, 200, "organization deleted");
  } catch (err) {
    return tryCatchError(res, err);
  }
};
