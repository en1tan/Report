const PartnerUser = require("../../models/partners/PartnerUser");
const { tryCatchError } = require("../../utils/errorHandlers");
const { successWithData } = require("../../utils/successHandler");

exports.getAllStaff = async (req, res, next) => {
  let { page = 1, limit = 20 } = req.query;
  let filter = req.query;
  filter.stateOfAssignment = req.user.stateOfAssignment;
  try {
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
  } catch (err) {}
};

exports.editStaff = async (req, res, next) => {
  try {
    const staff = await PartnerUser.findById(req.params.id);
    if (!staff) return normalError(res, 404, "Staff data not found");
    const updatedStaff = await PartnerUser.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    return successWithData(
      res,
      200,
      "Staff updated successfully.",
      updatedStaff,
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.deleteStaff = async (req, res, next) => {
  try {
    const staff = await PartnerUser.findById(req.params.id);
    if (!staff) return normalError(res, 404, "Staff data not found");
    await PartnerUser.findByIdAndDelete(req.params.id);
    return successNoData(res, 200, "Staff deleted successfully.");
  } catch (err) {
    return tryCatchError(res, err);
  }
};
