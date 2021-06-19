const PublicUser = require("../../models/PublicUser");
const TokenModel = require("../../models/Token");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { clientURL } = require("../../config");
const { sendMail } = require("../../utils/sendMail");

const { normalError, tryCatchError } = require("../../utils/errorHandlers");
const { successNoData } = require("../../utils/successHandler");

exports.requestPasswordRequest = async (req, res) => {
  try {
    const user = await PublicUser.findOne({ email: req.body.email });

    if (!user) return normalError(res, 404, "account does not exist");
    let token = await TokenModel.findOne({ userID: user._id });
    if (token) await token.deleteOne();
    let resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, 12);

    await new TokenModel({
      userID: user._id,
      token: hash,
      createdAt: Date.now(),
    }).save();

    const resetLink = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;
    sendMail(
      res,
      user.email,
      "Password Reset Request",
      {
        name: user.name,
        link: resetLink,
      },
      "../controllers/auth/template/requestResetPassword.handlebars"
    );
    return successNoData(res, 200, "password reset link sent successfully.");
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    let passwordResetToken = await TokenModel.findOne({
      userID: req.body.id,
    });
    if (!passwordResetToken)
      return normalError(res, 400, "Invalid or expired password reset token");

    const isValid = await bcrypt.compare(
      req.body.token,
      passwordResetToken.token
    );
    if (!isValid)
      return normalError(res, 400, "Invalid or expired password reset token.");

    const hash = await bcrypt.hash(req.body.password, 12);
    await PublicUser.updateOne(
      { _id: req.body.id },
      { $set: { password: hash } },
      { new: true }
    );
    const user = await PublicUser.findById(req.body.id);
    sendMail(
      res,
      user.email,
      "Password Reset Successfully",
      { name: user.firstName },
      "../controllers/auth/template/resetPasswordSuccessful.handlebars"
    );
    await passwordResetToken.deleteOne();
    return successNoData(res, 200, "password reset successfully");
  } catch (err) {
    return tryCatchError(res, err);
  }
};
