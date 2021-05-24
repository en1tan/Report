const ContactUs = require("../../models/ContactUs");

const { tryCatchError } = require("../../utils/errorHandlers");
const {
  successWithData,
  successNoData,
} = require("../../utils/successHandler");

exports.createContact = async (req, res, next) => {
  try {
    const contactData = Object.assign(
      { userID: req.user._id },
      req.body,
    );
    const newContact = await ContactUs.create(contactData);
    const data = {
      contact: newContact,
    };
    return successWithData(
      res,
      200,
      "Contact Request Created Succesfully",
      data,
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};
