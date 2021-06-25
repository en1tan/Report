const jwt = require("jsonwebtoken");

const User = require("../../models/partners/PartnerUser");
const TokenModel = require("../../models/Token");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { clientURL } = require("../../config");
const {
  validationError,
  tryCatchError,
  normalError,
} = require("../../utils/errorHandlers");
const {
  successWithData,
  successNoData,
} = require("../../utils/successHandler");
const { sendMail } = require("../../utils/sendMail");

const signToken = (id, userType) => {
  return jwt.sign({ id, userType }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user._id, user.userType);
  const data = {
    token,
    user,
  };
  return successWithData(res, statusCode, message, data);
};

exports.signup = async (req, res) => {
  let errors = {};
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      errors.email = "Email already exists";
      return normalError(res, 400, "Unable to create user", errors);
    }
    const newUser = await User.create(req.body);
    newUser.password = null;
    let token = await TokenModel.findOne({ userID: newUser._id });
    if (token) await token.deleteOne();
    let resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, 12);

    await new TokenModel({
      userID: newUser._id,
      token: hash,
      createdAt: Date.now(),
    }).save();
    const resetLink = `${clientURL}/partner/resetPassword?token=${resetToken}&id=${newUser._id}`;
    sendMail(
      res,
      newUser.email,
      "New Account Created",
      {
        name: newUser.firstName,
        link: resetLink,
      },
      "../controllers/auth/template/newAccount.handlebars",
    );
    return successWithData(
      res,
      201,
      "Admin user created successfully",
      newUser,
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.signin = async (req, res, next) => {
  const { userName, password } = req.body;
  try {
    const user = await User.findOne({ userName }).select("+password");
    if (
      !user ||
      !(await user.correctPassword(password, user.password))
    ) {
      return validationError(res, "Authentication error");
    }

    await User.findByIdAndUpdate(
      user._id,
      { onlineStatus: "online" },
      { new: true },
    );

    createSendToken(user, 200, res, "User authorized");
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.partnerProfile = async (req, res, next) => {
  return successWithData(res, 200, "User details", req.user);
};

exports.editAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return validationError(res, "Authentication error");
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      req.body,
      {
        new: true,
      },
    );
    return successWithData(
      res,
      200,
      "User records updated successfully",
      updatedUser,
    );
  } catch (err) {
    n;
    return tryCatchError(res, err);
  }
};

exports.requestPartnerPasswordRequest = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

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

    const resetLink = `${clientURL}/partner/resetPassword?token=${resetToken}&id=${user._id}`;
    sendMail(
      res,
      user.email,
      "Password Reset Request",
      {
        name: user.name,
        link: resetLink,
      },
      "../controllers/auth/template/requestResetPassword.handlebars",
    );
    return successNoData(
      res,
      200,
      "password reset link sent successfully.",
    );
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
      return normalError(
        res,
        400,
        "Invalid or expired password reset token",
      );
    const isValid = await bcrypt.compare(
      req.body.token,
      passwordResetToken.token,
    );
    if (!isValid)
      return normalError(
        res,
        400,
        "Invalid or expired password reset token.",
      );
    const hash = await bcrypt.hash(req.body.password, Number(10));
    await User.findByIdAndUpdate(
      req.body.id,
      { $set: { password: hash } },
      { new: true },
    );
    const user = await User.findById(req.body.id);
    sendMail(
      res,
      user.email,
      "Password Reset Successfully",
      { name: user.firstName },
      "../controllers/auth/template/resetPasswordSuccessful.handlebars",
    );
    await passwordResetToken.deleteOne();
    return successNoData(res, 200, "password reset successfully");
  } catch (err) {
    return tryCatchError(res, err);
  }
};
