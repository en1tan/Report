const jwt = require('jsonwebtoken');
const _ = require('lodash');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

const User = require('../../models/PublicUser');
const TokenModel = require('../../models/Token');
const RefreshToken = require('../../models/RefreshToken');

const {
  tryCatchError,
  normalError,
  authorizationError,
  validationError,
} = require('../../utils/errorHandlers');
const {
  successWithData,
  successNoData,
} = require('../../utils/successHandler');
const { sendMail } = require('../../utils/sendMail');
const { shUrl } = require('../../utils/shortenUrl');
const { serverURL } = require('../../config');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
    algorithm: 'HS256',
  });
};

const createSendToken = async (user, statusCode, res, message, ip) => {
  const token = signToken(user._id);
  const refreshToken = generateRefreshToken(user, ip);
  await refreshToken.save();
  const data = {
    token,
    refreshToken,
    user,
  };
  return successWithData(res, statusCode, message, data);
};

/**
 * User sign up
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<successNoData | normalError | tryCatchError>}
 */
exports.signup = async function (req, res) {
  const { email, userName, phoneNumber } = req.body;
  try {
    const errors = {};
    if (await User.findOne({ email })) errors.email = 'email already exists';
    if (await User.findOne({ userName: userName.toLowerCase() }))
      errors.username = 'username already in use';
    if (await User.findOne({ phoneNumber }))
      errors.phoneNumber = 'phone number already in use';
    if (!_.isEmpty(errors))
      return normalError(res, 400, 'Unable to create user', {
        errors,
      });

    req.body.userName = req.body.userName.toLowerCase();
    const newUser = await User.create(req.body);
    if (newUser) {
      const token = await TokenModel.findOne({ userID: newUser._id });
      if (token) await token.deleteOne();
      const activateToken = crypto.randomBytes(32).toString('hex');
      const newToken = await TokenModel.create({
        userID: newUser._id,
        token: activateToken,
        createdAt: Date.now(),
      });
      const activateLink = `${serverURL}/user/verifyEmail/${newToken._id}`;
      const link = await shUrl(activateLink);
      await sendMail(
        res,
        newUser.email,
        'Activate Your Account',
        {
          name: `${newUser.lastName} ${newUser.firstName}`,
          link: link.shortUrl,
        },
        '../controllers/auth/template/activateAccount.handlebars'
      );
      return successNoData(res, 201, 'User created successfully');
    } else {
      return normalError(res, 400, 'an error occurred. please try again');
    }
  } catch (err) {
    return tryCatchError(res, err);
  }
};

/**
 * User sign in
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<successNoData | normalError | tryCatchError>}
 */
exports.signin = async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await User.findOne({
      userName: userName.toLowerCase(),
    }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return authorizationError(res, 'Username or password is incorrrect');
    }
    if (user && !user.emailVerified) {
      await generateActivationToken(user, res);
      return normalError(
        res,
        403,
        'email not verified. a verification email as be sent to you kindly click on the link to activated email'
      );
    }
    await User.findByIdAndUpdate(
      user._id,
      { onlineStatus: 'online' },
      { new: true }
    );
    const data = _.omit(user.toObject(), 'password');
    await createSendToken(data, 200, res, 'User authorized', req.ip);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

/**
 * User profile
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<successNoData | normalError | tryCatchError>}
 */
exports.profile = async (req, res) => {
  if (!req.user) return authorizationError(res, 'User unauthorized');
  const data = _.omit(req.user.toObject(), 'password');
  return successWithData(res, 200, 'User details', data);
};

exports.editAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return validationError(res, 'Authentication error');
    const updatedUser = await User.findByIdAndUpdate(user._id, req.body, {
      new: true,
    });
    return successWithData(
      res,
      200,
      'User records updated successfully',
      updatedUser
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.activateAccount = async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    if (!user)
      return normalError(
        res,
        400,
        'Account does not exist. Please register your account'
      );
    const activateToken = await TokenModel.findOne({
      userID: user._id,
    });
    if (activateToken && activateToken.otpVerified === false)
      return normalError(
        res,
        400,
        'otp not verified. please try again or contact support',
        null
      );
    await activateToken.deleteOne();
    await User.findByIdAndUpdate(req.body.id, { active: true });
    return successNoData(res, 200, 'account activated successfully');
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
    path.join(__dirname, './template/activate.handlebars'),
    'utf-8'
  );
  const compiledTemplate = handlebars.compile(source);
  return res.status(200).send(
    compiledTemplate({
      name: user ? user.lastName : '',
      activateStatus: activateStatus === true ? activateStatus : null,
    })
  );
};

exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = await getRefreshToken(req.body.token);
    const { user } = refreshToken;

    // replace old refresh token with a new one and save
    const newRefreshToken = generateRefreshToken(user, req.ip);
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIP = req.ip;
    refreshToken.replacedByToken = newRefreshToken.token;
    await refreshToken.save();
    await newRefreshToken.save();

    const token = signToken(user._id);
    const data = {
      token,
      refreshToken,
    };
    return successWithData(res, 200, 'token refreshed', data);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

async function generateActivationToken(user, res) {
  const token = await TokenModel.findOne({ userID: user._id });
  if (token) await token.deleteOne();
  const activateToken = crypto.randomBytes(32).toString('hex');
  const newToken = await TokenModel.create({
    userID: user._id,
    token: activateToken,
    createdAt: Date.now(),
  });
  const activateLink = `${serverURL}/user/verifyEmail/${newToken._id}`;
  await sendMail(
    res,
    user.email,
    'Activate Your Account',
    {
      name: `${user.lastName} ${user.firstName}`,
      link: activateLink,
    },
    '../controllers/auth/template/activateAccount.handlebars'
  );
}

function generateRefreshToken(user, ipAddress) {
  return new RefreshToken({
    user: user._id,
    token: randomTokenString(),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdByIP: ipAddress,
  });
}

async function getRefreshToken(token) {
  const refreshToken = await RefreshToken.findOne({ token }).populate('user');
  if (!refreshToken || !refreshToken.isActive) throw 'Invalid token';
  return refreshToken;
}

function randomTokenString() {
  return crypto.randomBytes(40).toString('hex');
}
