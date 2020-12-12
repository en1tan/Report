const Case = require("../../models/cases/Case");
const CaseCategoryGroup = require("../../models/cases/CaseCategoryGroup");
const CaseCategory = require("../../models/cases/CaseCategory");
const CaseVictim = require("../../models/cases/CaseVictim");
const CaseSuspect = require("../../models/cases/CaseSuspect");
const CaseWitness = require("../../models/cases/CaseWitness");
const CaseOtherDetails = require("../../models/cases/CaseOtherDetails");
const CaseProgress = require("../../models/cases/CaseProgress");
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

exports.getAllCase = async (req, res, next) => {
  try {
    const cases = await Case.find();
    const data = {
      cases
    };
    return successWithData(res, 200, "Case Fetched Succesfully", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
}

exports.createCase = async (req, res, next) => {
  try {
    const newCase = await Case.create({
      ...req.body,
      publicUserID: req.user._id,
    });
    const data = {
      case: newCase,
    };
    return successWithData(res, 200, "Case Created Succesfully", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.createCaseCategoryGroup = async (req, res, next) => {
  try {
    const newGroup = await CaseCategoryGroup.create({
      ...req.body,
    });
    const data = {
      group: newGroup,
    };
    return successWithData(res, 200, "Case Group Created Succesfully", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
}

exports.createCaseCategory = async (req, res, next) => {
  try {
    const newCategory = await CaseCategory.create({
      ...req.body,
      categoryGroupID: req.params.groupID
    });
    const data = {
      category: newCategory,
    };
    return successWithData(res, 200, "Case Category Created Succesfully", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
}

exports.createCaseVictim = async (req, res, next) => {
  try {
    const newVictim = await CaseVictim.create({
      ...req.body,
      caseID: req.params.caseID
    });
    const data = {
      victim: newVictim,
    };
    return successWithData(res, 200, "Victim Created Succesfully", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
}

exports.createCaseSuspect = async (req, res, next) => {
  try {
    const newSuspect = await CaseSuspect.create({
      ...req.body,
      caseID: req.params.caseID
    });
    const data = {
      suspect: newSuspect,
    };
    return successWithData(res, 200, "Suspect Created Succesfully", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
}

exports.createCaseWitness = async (req, res, next) => {
  try {
    const newWitness = await CaseWitness.create({
      ...req.body,
      caseID: req.params.caseID
    });
    const data = {
      witness: newWitness,
    };
    return successWithData(res, 200, "Witness Created Succesfully", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
}

exports.createCaseOtherDetails = async (req, res, next) => {
  try {
    const newDetails = await CaseOtherDetails.create({
      ...req.body,
      caseID: req.params.caseID,
      userID: req.user._id
    });
    const data = {
      details: newDetails,
    };
    return successWithData(res, 200, "More Details Updated Succesfully", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
}

exports.createCaseProgress = async (req, res, next) => {
  try {
    const newProgress = await CaseProgress.create({
      ...req.body,
      caseID: req.params.caseID,
    });
    const data = {
      progress: newProgress,
    };
    return successWithData(res, 200, "Progress Saved Succesfully", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
}

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