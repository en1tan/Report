const PublicUser = require("../../models/PublicUser");
const TokenModel = require("../../models/Token");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const {sendSms} = require("../../utils/sendSms");
const {generateOtp} = require('../../utils/otp');

const {
  normalError,
  tryCatchError,
} = require("../../utils/errorHandlers");
const {
  successNoData,
  successWithData,
} = require("../../utils/successHandler");

/**
 * Request Password Reset
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {successWithData} successMessageWithData
 */
exports.requestPasswordReset = async (req, res) => {
  try {
    const user = await PublicUser.findOne({
      phoneNumber: req.body.phoneNumber,
    });
    if (!user) return normalError(res, 404, "account does not exist");
    let token = await TokenModel.findOne({userID: user._id});
    if (token) await token.deleteOne();
    let resetToken = crypto.randomBytes(32).toString("hex");
    const otp = generateOtp();
    const newToken = await new TokenModel({
      userID: user._id,
      token: resetToken,
      otp,
      createdAt: Date.now(),
    }).save();
    await sendSms(user.phoneNumber, otp);
    return successWithData(
      res,
      200,
      "otp sent to your phone number. please be patient, the message may take a few minutes",
      {tokenID: newToken._id},
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const token = await TokenModel.findOne({otp: req.body.otp});
    if (!token) return normalError(res, 400, "invalid otp code");
    await TokenModel.findByIdAndUpdate(token._id, {
      otpVerified: true,
    });
    return successNoData(res, 200, "otp verified successfully");
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.sendOtp = async (req, res) => {
  try {
    const user = await PublicUser.findOne({
      phoneNumber: req.body.phoneNumber,
    });
    if (!user) return normalError(res, 404, "user not found");
    const token = await TokenModel.findOne({userID: user._id});
    if (!token)
      return normalError(
        res,
        400,
        "invalid session. please contact support",
      );
    const otp = generateOtp();
    const newToken = await TokenModel.findByIdAndUpdate(
      token._id,
      {otp},
      {new: true},
    );
    await sendSms(user.phoneNumber, `Your OTP code is: ${newToken.otp}.`);
    return successWithData(
      res,
      200,
      "otp sent to your phone number. please be patient, the message may take a few minutes",
      {tokenID: newToken._id},
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const token = await TokenModel.findById(req.body.tokenID);
    const user = await PublicUser.findById(token.userID);
    if (!token) {
      return normalError(
        res,
        400,
        "invalid request password session. please try again",
      );
    }
    if (token && !user) {
      return normalError(
        res,
        400,
        "no account is attached to this session. please try again",
      );
    }
    const otp = generateOtp();
    const newToken = await TokenModel.findByIdAndUpdate(
      token._id,
      {otp, otpVerified: false},
      {new: true},
    );
    await sendSms(user.phoneNumber, newToken.otp);
    return successNoData(
      res,
      200,
      "otp sent to your phone number. please be patient, the message may take a few minutes",
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

/**
 * Reset User Password
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<{}>}
 */
exports.resetPassword = async (req, res) => {
  try {
    let passwordResetToken = await TokenModel.findById(
      req.body.TokenID,
    );
    if (!passwordResetToken)
      return normalError(
        res,
        400,
        "Invalid or expired password reset token",
      );

    if (passwordResetToken.otpVerified === false)
      return normalError(
        res,
        400,
        "otp not verified. please try again",
      );

    const hash = await bcrypt.hash(req.body.password, 12);
    await PublicUser.findByIdAndUpdate(passwordResetToken.userID, {
      password: hash,
    });
    await passwordResetToken.deleteOne();
    return successNoData(res, 200, "password reset successfully");
  } catch (err) {
    return tryCatchError(res, err);
  }
};
