const Case = require("../../models/Case");
const Evidence = require("../../models/Evidence");
const caseEvidence = require("./evidence");

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

exports.createCase = async (req, res, next) => {
  try {
    const newCase = await Case.create({
      ...req.body,
    });
    const data = {
      property: newCase,
    };
    return successWithData(res, 200, "Case Created Succesfully", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.saveEvidence = async (req, res, next) => {
  try {
    const allEvidence = {};
    if (req.files && req.files.length > 0) {
      const evidenceImages = await caseEvidence.uploadEvidenceImages(req.files);
      evidenceImages.forEach((el, i) => {
        allEvidence[`evidence${i + 1}`] = el.url;
      });
    }
    const newEvidence = await Evidence.create({
      ...allEvidence,
    });
    
    const updatedCase = await Case.findOneAndUpdate(
      { _id: req.params.id },
      { evidence: newEvidence._id },
      {new: true}
    );

    const data = {
      case: updatedCase,
    };

    return successWithData(res, 201, "Evidence Saved Succesfully", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.editEvidence = async (req, res, next) => {
  console.log("here")
  try {
    const editedCase = await Case.findOneAndUpdate(
      {  _id: req.params.id },
      {...req.body},
      { new: true }
    );
    const data = {
      case: editedCase,
    };
    return successWithData(res, 201, "Case Saved Succesfully", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
}