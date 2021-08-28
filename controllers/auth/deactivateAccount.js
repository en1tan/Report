const DeactivateAccount = require('../../models/DeactivateAccounts');
const PublicUser = require('../../models/PublicUser');
const {
  tryCatchError,
  normalError,
  authorizationError,
} = require('../../utils/errorHandlers');
const { successNoData } = require('../../utils/successHandler');

exports.deactivate = async (req, res) => {
  try {
    const user = await PublicUser.findById(req.user._id);
    if (!user) return normalError(res, 404, 'account not found');
    if (
      user &&
      !(await user.correctPassword(req.body.password, user.password))
    ) {
      return authorizationError(res, 'password is incorrect');
    }
    req.body.publicUserID = user._id;
    await DeactivateAccount.create(req.body);
    return successNoData(
      res,
      201,
      'application for account deletion succesful'
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.cancelDeactivation = async (req, res) => {
  try {
    const user = await PublicUser.findOne({ email: req.body.email });
    if (!user) return normalError(res, 404, 'account not found');
    const existingApplication = await DeactivateAccount.findOne({
      publicUserID: user._id,
    });
    if (!existingApplication)
      return normalError(res, 404, 'you did not apply for account deletion');
    existingApplication.deleteOne();
    return successNoData(res, 200, 'application closed succesfully');
  } catch (err) {
    return tryCatchError(res, err);
  }
};
