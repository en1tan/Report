const DeactivateAccount = require('../models/DeactivateAccounts');
const PublicUser = require('../models/PublicUser');
module.exports = {
  // Deactivate Account
  deactivateAccounts: async () => {
    console.log('Deleting deactivated acconts');
    const currentDate = new Date(Date.now()).getTime();
    try {
      const accounts = await DeactivateAccount.find({
        dateToDelete: currentDate,
      });
      while (accounts.length > 0) {
        for (let i = 0; i < accounts.length; i++) {
          const user = await PublicUser.findById(account[i].publicUserID);
          if (user && account[i].type === 'permanent') {
            await user.deleteOne();
            await DeactivateAccount.findOneAndUpdate(account[i]._id, {
              status: 'success',
            });
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  },
};
