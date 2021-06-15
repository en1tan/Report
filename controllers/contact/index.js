const ContactUs = require("../../models/ContactUs");

const { tryCatchError, normalError } = require("../../utils/errorHandlers");
const {
  successNoData,
  successWithData,
} = require("../../utils/successHandler");

exports.createContact = async (req, res, next) => {
  try {
    await ContactUs.create(req.body);
    return successNoData(res, 200, "Contact enquiry submitted successfully");
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.listAllContactRequests = async (req, res) => {
  try {
    let { page = 1, limit = 20 } = req.query;
    const contacts = await ContactUs.find()
      .sort("-createdAt")
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const count = await ContactUs.countDocuments();
    const data = {
      contacts,
      total: Math.ceil(count / limit),
      page: parseInt(page),
    };
    return successWithData(res, 200, "contact details fetched", contacts);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.getOneContact = async (req, res) => {
  try {
    const contact = await ContactUs.findById(req.params.id);
    if (!contact) return normalError(res, 404, "enquiry not found");
    return successWithData(res, 200, "enquiry fetched", contact);
  } catch (err) {
    return tryCatchError(res, err);
  }
};
