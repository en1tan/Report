const jwt = require("jsonwebtoken");
const _ = require("lodash");
const crypto = require("crypto");
const User = require("../../models/PublicUser");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

const {
  tryCatchError,
  normalError,
  authorizationError,
  validationError,
} = require("../../utils/errorHandlers");
const {
  successWithData,
  successNoData,
} = require("../../utils/successHandler");
const { sendMail } = require("../../utils/sendMail");
const TokenModel = require("../../models/Token");
const { serverURL } = require("../../config");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
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

exports.signup = async function (req, res) {
  const { email, userName, phoneNumber } = req.body;
  try {
    const errors = {};
    if (await User.findOne({ email }))
      errors.email = "email already exists";
    if (await User.findOne({ userName: userName.toLowerCase() }))
      errors.username = "username already in use";
    if (await User.findOne({ phoneNumber }))
      errors.phoneNumber = "phone number already in use";
    if (!_.isEmpty(errors))
      return normalError(res, 400, "Unable to create user", {
        errors,
      });

    req.body.userName = req.body.userName.toLowerCase();
    const newUser = await User.create(req.body);
    if (newUser) {
      const token = await TokenModel.findOne({ userID: newUser._id });
      if (token) await token.deleteOne();
      const activateToken = crypto.randomBytes(32).toString("hex");
      const newToken = await TokenModel.create({
        userID: newUser._id,
        token: activateToken,
        createdAt: Date.now(),
      });
      const activateLink = `${serverURL}/user/verifyEmail/${newToken._id}`;
      sendMail(
        res,
        newUser.email,
        "Activate Your Account",
        {
          name: `${newUser.lastName} ${newUser.firstName}`,
          link: activateLink,
        },
        "../controllers/auth/template/activateAccount.handlebars",
      );
      return successNoData(res, 201, "User created successfully");
    } else {
      return normalError(
        res,
        400,
        "an error occured. please try again",
      );
    }
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.signin = async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await User.findOne({ userName: userName.toLowerCase()}).select("+password");
    if (
      !user ||
      !(await user.correctPassword(password, user.password))
    ) {
      return authorizationError(
        res,
        "Username or password is incorrrect",
      );
    }
    if (user && !user.emailVerified) {
const token = await TokenModel.findOne({ userID: user._id });
      if (token) await token.deleteOne();
      const activateToken = crypto.randomBytes(32).toString("hex");
      const newToken = await TokenModel.create({
        userID: user._id,
        token: activateToken,
        createdAt: Date.now(),
      });
const activateLink = `${serverURL}/user/verifyEmail/${newToken._id}`;
      sendMail(
        res,
        user.email,
        "Activate Your Account",
        {
          name: `${user.lastName} ${user.firstName}`,
          link: activateLink,
        },
        "../controllers/auth/template/activateAccount.handlebars",
      );
      return normalError(res, 403, "email not verified. a verification email as be sent to you kindly click on the link to activated email");
}
    await User.findByIdAndUpdate(
      user._id,
      { onlineStatus: "online" },
      { new: true },
    );
    const data = _.omit(user.toObject(), "password");
    createSendToken(data, 200, res, "User authorized");
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.profile = async (req, res) => {
  if (!req.user) return authorizationError(res, "User unauthorized");
  const data = _.omit(req.user.toObject(), "password");
  return successWithData(res, 200, "User details", data);
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
    return tryCatchError(res, err);
  }
};

exports.activateAccount = async (req, res) => {
  try {
    const activateToken = await TokenModel.findOne({
      userID: req.body.id,
    });
    if (!activateToken)
      return normalError(
        res,
        400,
        "Account does not exist. Please register your account",
      );
    if (activateToken && activateToken.otpVerified === false)
      return normalError(
        res,
        400,
        "otp not verified. please try again or contact support",
        null,
      );
    if (req.body.token !== activateToken.token)
      return normalError(
        res,
        400,
        "invalid or expired token. please contact support",
      );
    await User.findByIdAndUpdate(req.body.id, { active: true });
    activateToken.deleteOne();
    return successNoData(res, 200, "account activated successfully");
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.verifyEmail = async (req, res) => {
  let activateStatus = true;
  let user;
  const token = await TokenModel.findById(req.params.tokenID);
  if (!token) {
    activateStatus = false;
  } else {
    user = await User.findById(token.userID);
    if (!user) activateStatus = false;
    else {
      await User.findByIdAndUpdate(token.userID, {
        emailVerified: true,
      });
    }
  }
  const source = fs.readFileSync(
    path.join(__dirname, "./template/activate.handlebars"),
    "utf-8",
  );
  const compiledTemplate = handlebars.compile(source);
  return res.status(200).send(
    compiledTemplate({
      name: user ? user.lastName : "",
      activateStatus: activateStatus === true ? activateStatus : null,
    }),
  );
};
