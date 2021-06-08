const ContactUs = require("../../models/ContactUs");

const { tryCatchError } = require("../../utils/errorHandlers");
const {
  successNoData,
} = require("../../utils/successHandler");

exports.createContact = async (req, res, next) => {
  try {
    await ContactUs.create(req.body);
    return successNoData(
      res,
      200,
      "Contact enquiry submitted succesfully",
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};
