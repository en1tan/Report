const TokenModel = require("../../models/Token");
const PublicUser = require("../../models/PublicUser");
const { clientURL } = require("../../config");

exports.activateAccount = async (req, res) => {
  let activateStatus;
  const token = await TokenModel.findById(req.params.tokenID);
  console.log(token);
  if (!token) {
    console.log("here");
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
