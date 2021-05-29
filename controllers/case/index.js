const Case = require("../../models/cases/Case");
const CaseVictim = require("../../models/cases/CaseVictim");
const CaseSuspect = require("../../models/cases/CaseSuspect");
const CaseWitness = require("../../models/cases/CaseWitness");
const CaseOtherDetails = require("../../models/cases/CaseOtherDetails");
const CaseProgress = require("../../models/cases/CaseProgress");
const CaseEvidence = require("../../models/cases/CaseEvidence");
const { uploadEvidenceImages } = require("./cloudUpload");

const {
  tryCatchError,
  normalError,
} = require("../../utils/errorHandlers");
const {
  successWithData,
  successNoData,
} = require("../../utils/successHandler");

const _ = require("lodash");

exports.followCase = async (req, res, next) => {
  try {
    const existingCase = await Case.findById(req.params.id);
    if (!existingCase)
      return normalError(res, 404, "Case not found", null);
    if (req.body.followStatus === "follow") {
      existingCase.followedBy.push(req.user);
      await existingCase.save();
      return successNoData(res, 200, "Case followed successfully");
    } else {
      existingCase.followedBy.pop(req.user);
      await existingCase.save();
      return successNoData(res, 200, "Case unfollowed successfully");
    }
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.getFollowedCases = async (req, res, next) => {
  try {
    let { page = 1, limit = 20 } = req.query;
    const cases = await Case.find({ followedBy: req.user._id })
      .select("-followedBy -areYouTheVictim")
      .sort("-createdAt")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Case.countDocuments({
      followedBy: req.user._id,
    }).exec();
    const data = {
      cases,
      total: Math.ceil(count / limit),
      page: parseInt(page),
    };
    return successWithData(
      res,
      200,
      "Case Fetched Succesfully",
      data
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.assignPartnerToCase = async (req, res, next) => {
  try {
    const existingCase = await Case.findById(req.params.id);
    if (!existingCase)
      return normalError(res, 404, "Case not found", null);
    const updatedCase = await Case.findByIdAndUpdate(
      existingCase._id,
      {
        assignedPartnerUserId: req.body.partnerId,
      },
      { new: true }
    );
    return successWithData(
      res,
      200,
      "Partner assigned successfully",
      updatedCase
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.getAllCase = async (req, res, next) => {
  let { page = 1, limit = 20 } = req.query;
  const filter = _.pick(req.query, [
    "resolutionStatus",
    "verificationStatus",
    "platformOfReport",
    "publishStatus",
    "reportType",
    "caseTypeStatus",
  ]);
  filter.state = req.user.stateOfAssignment;
  if (req.user.userType === "staff")
    filter.assignedPartnerUserId = req.user._id;
  if (req.user.userType === "verifier")
    filter.verificationStatus = "unVerified";
  try {
    const cases = await Case.find(filter)
      .sort("-createdAt")
      .select("-followedBy -areYouTheVictim  -publicUserID")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Case.countDocuments(filter).exec();
    const data = {
      cases,
      total: Math.ceil(count / limit),
      page: parseInt(page),
    };
    return successWithData(
      res,
      200,
      "Cases Fetched Succesfully",
      data
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.getCase = async (req, res, next) => {
  try {
    const fetchedCase = await Case.findOne({
      _id: req.params.id,
    })
      .select("-followedBy")
      .exec();
    if (!fetchedCase) return normalError(res, 404, "Case not found");
    let witness;
    let victim;
    let suspect;
    if (fetchedCase) {
      witness = await CaseWitness.findOne({ caseID: req.params.id });
      victim = await CaseVictim.findOne({ caseID: req.params.id });
      suspect = await CaseSuspect.findOne({ caseID: req.params.id });
    }
    const data = {
      caseData: {
        case: fetchedCase,
        victim,
        witness,
        suspect,
      },
    };
    return successWithData(
      res,
      200,
      "Case Fetched Succesfully",
      data
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.createCase = async (req, res, next) => {
  try {
    const newCase = await Case.create({
      ...req.body,
      publicUserID: req.user._id,
    });
    const data = {
      case: newCase,
    };
    return successWithData(
      res,
      200,
      "Case Created Succesfully",
      data
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.createCaseVictim = async (req, res, next) => {
  try {
    req.body.caseID = req.params.caseID;
    const newVictim = await CaseVictim.create(req.body);
    const data = {
      victim: newVictim,
    };
    return successWithData(
      res,
      200,
      "Victim Created Succesfully",
      data
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.createCaseSuspect = async (req, res, next) => {
  try {
    const newSuspect = await CaseSuspect.create({
      ...req.body,
      caseID: req.params.caseID,
    });
    const data = {
      suspect: newSuspect,
    };
    return successWithData(
      res,
      200,
      "Suspect Created Succesfully",
      data
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.createCaseWitness = async (req, res, next) => {
  try {
    const newWitness = await CaseWitness.create({
      ...req.body,
      caseID: req.params.caseID,
    });
    const data = {
      witness: newWitness,
    };
    return successWithData(
      res,
      200,
      "Witness Created Succesfully",
      data
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.createCaseOtherDetails = async (req, res, next) => {
  try {
    const newDetails = await CaseOtherDetails.create({
      ...req.body,
      caseID: req.params.caseID,
      userID: req.user._id,
    });
    const data = {
      details: newDetails,
    };
    return successWithData(
      res,
      200,
      "More Details Updated Succesfully",
      data
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.createCaseProgress = async (req, res, next) => {
  try {
    const newProgress = await CaseProgress.create({
      ...req.body,
      caseID: req.params.caseID,
    });
    const data = {
      progress: newProgress,
    };
    return successWithData(
      res,
      200,
      "Progress Saved Succesfully",
      data
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.saveEvidence = async (req, res, next) => {
  try {
    const allEvidence = [];

    if (req.files && req.files.length > 0) {
      const evidenceImages = await uploadEvidenceImages(req.files);
      evidenceImages.forEach((el, i) => {
        allEvidence.push({
          fileName: `evidence${i + 1}`,
          URL: el.url,
          caseID: req.params.id,
        });
      });
    }
    await CaseEvidence.insertMany(allEvidence);
    return successNoData(res, 201, "Evidence Saved Succesfully");
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.editEvidence = async (req, res, next) => {
  try {
    const editedCase = await Case.findOneAndUpdate(
      { _id: req.params.id },
      { ...req.body },
      { new: true }
    );
    const data = {
      case: editedCase,
    };
    return successWithData(res, 201, "Case Saved Succesfully", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.getPersonalCases = async (req, res, next) => {
  try {
    const cases = await Case.find({ publicUserID: req.user.id })
      .sort("-created")
      .select("-followedBy");
    return successWithData(res, 200, "Fetched cases", {
      data: { cases },
    });
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.verifyCase = async (req, res, next) => {
  try {
    const existingCase = await Case.findById(req.params.id).select(
      "-followedBy -areYouTheVictim"
    );
    if (!existingCase)
      return normalError(res, 404, "Case does not exist");
    const updatedCase = await Case.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: req.body.verificationStatus },
      { new: true }
    );
    return successWithData(
      res,
      200,
      "Case verified successfully",
      updatedCase
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.publishCase = async (req, res, next) => {
  try {
    const existingCase = await Case.findById(req.params.id);
    if (!existingCase)
      return normalError(res, 404, "Case does not exist");

    const publishedCase = await Case.findByIdAndUpdate(
      existingCase._id,
      {
        publishStatus: req.body.publishStatus,
        publishedBy: req.user,
      },
      { new: true }
    );
    return successWithData(
      res,
      200,
      "Case published successfully",
      publishedCase
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.resolveCase = async (req, res, next) => {
  try {
    const existingCase = await Case.findById(req.params.id);
    if (!existingCase)
      return normalError(res, 404, "Case does not exist");

    const resolvedCase = await Case.findByIdAndUpdate(
      existingCase._id,
      {
        resolutionStatus: req.body.resolutionStatus,
      },
      { new: true }
    );
    return successWithData(
      res,
      200,
      "Case resolved successfully",
      resolvedCase
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};
