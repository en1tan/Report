const ContactUs = require("../../models/ContactUs");

const ApiFeatures = require("../../utils/apiFeatures");
const {
  validationError,
  tryCatchError,
  normalError,
} = require("../../utils/errorHandlers");
const {
  successWithData,
  successNoData,
} = require("../../utils/successHandler");

exports.createContact = async (req, res, next) => {
  try {
    const newContact = await ContactUs.create({
      ...req.body,
    });
    const data = {
      contact: newContact,
    };
    return successWithData(res, 200, "Contact Request Created Succesfully", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
};
