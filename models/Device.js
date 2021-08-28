const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deviceSchema = new Schema({
  deviceUUID: {
    type: String,
    required: true,
  },
  registrationToken: {
    type: String,
    required: true,
  },
  publicUserID: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Device', deviceSchema);
