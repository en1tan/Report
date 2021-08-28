const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deactivateAccountSchema = new Schema({
  publicUserID: {
    type: Schema.Types.ObjectId,
    ref: 'PublicUser',
  },
  reason: {
    type: String,
  },
  dateToDelete: {
    type: Date,
    default: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // Set deletion date to 15 days after requested
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'success'],
  },
});

module.exports = mongoose.model('DeactivateAccount', deactivateAccountSchema);
