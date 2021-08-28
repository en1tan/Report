const Device = require('../../models/Device');
const { tryCatchError } = require('../../utils/errorHandlers');
const {
  successWithData,
  successNoData,
} = require('../../utils/successHandler');

exports.registerDevice = async (req, res) => {
  try {
    req.body.publicUserID = req.user._id;
    const device = await Device.create(req.body);
    return successWithData(res, 201, 'Device created successfully', {
      data: device,
    });
  } catch (err) {
    tryCatchError(res, err);
  }
};

exports.refreshDevice = async (req, res) => {
  try {
    req.body.publicUserID = req.user._id;
    const device = await Device.findOne({ publicUserID: req.user._id });
    if (!device) await Device.create(req.body);
    return successNoData(res, 200, 'Device refreshed successfullly');
  } catch (err) {
    return tryCatchError(res, err);
  }
};
