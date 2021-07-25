const TokenModel = require("../../models/Token");
const PublicUser = require("../../models/PublicUser");

exports.activateAccount = async (req, res) => {
  let activateStatus;
  const token = await TokenModel.findById(req.params.tokenID);
  if (!token) {
    return res.render("activate", { activateStatus });
  }
  const user = await PublicUser.findById(token.userID);
  if (!user) activateStatus = false;
  else activateStatus = true;
  return res.render("activate", {
    name: user.lastName,
    activateStatus,
  });
};
