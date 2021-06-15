const PartnerBranch = require("../../models/partners/PartnersBranches");
const Partner = require("../../models/partners/Partners");
const PartnerUser = require("../../models/partners/PartnerUser");
const Case = require("../../models/cases/Case");
const { tryCatchError, normalError } = require("../../utils/errorHandlers");
const {
  successWithData,
  successNoData,
} = require("../../utils/successHandler");

const _ = require("lodash");

exports.fetchPartnerUser = async (req, res) => {
  try {
    const user = await PartnerUser.findById(req.params.id);
    if (!user) return normalError(res, 404, "user not found");
    const cases = await Case.find({ assignedPartnerUserID: user._id });
    const data = {
      user,
      cases,
    };
    return successWithData(res, 200, "user found", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
};
