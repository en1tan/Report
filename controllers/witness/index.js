const _ = require("lodash");

const Model = require("../../models/cases/CaseWitness");
const Case = require("../../models/cases/Case");
const { tryCatchError, normalError } = require("../../utils/errorHandlers");
const {
  successWithData,
  successNoData,
} = require("../../utils/successHandler");

exports.createWitness = async (req, res) => {
  try {
    const existingCase = await Case.findById(req.params.caseID);
    if (!existingCase) return normalError(res, 404, "case not found");
    req.body.caseID = existingCase._id;
    req.body.addedBy = req.user._id;
    const witness = await Model.create(req.body);
    return successWithData(
      res,
      201,
      "witness created successfully",
      _.pick(witness, [
        "firstNameOfWitness",
        "middleNameOfWitness",
        "lastNameOfWitness",
        "_id",
        "__v",
      ])
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.getWitnesses = async (req, res) => {
  try {
    const existingCase = await Case.findById(req.params.caseID);
    if (!existingCase) return normalError(res, 404, "case not found");
    const witnesses = await Model.find({ caseID: req.params.caseID }).select(
      "firstNameOfWitness middleNameOfWitness lastNameOfWitness"
    );
    return successWithData(res, 200, "fetched all witnesses", witnesses);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.getWitness = async (req, res) => {
  try {
    const witness = await Model.findById(req.params.id);
    if (!witness) return normalError(res, 404, "witness not found");
    return successWithData(res, 200, "witness fetched successfully", witness);
  } catch (err) {
    return tryCatchError(res, err);
  }
};
exports.updateWitness = async (req, res) => {
  try {
    const witness = await Model.findById(req.params.id).select(
      "firstNameOfSuspect middleNameOfSuspect lastNameOfSuspect"
    );
    if (!witness) return normalError(res, 404, "witness not found");
    await Model.findByIdAndUpdate(witness._id, req.body, {
      new: true,
    });
    return successNoData(res, 200, "witness updated successfully");
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.deleteWitness = async (req, res) => {
  const witness = await Model.findById(req.params.id).select(
    "firstNameOfSuspect middleNameOfSuspect lastNameOfSuspect"
  );
  if (!witness) return normalError(res, 404, "witness not found");
  await Model.findByIdAndDelete(witness._id);
  return successNoData(res, 200, "witness delete successfully");
};
