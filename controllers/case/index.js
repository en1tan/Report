const Case = require("../../models/cases/Case");
const CaseVictim = require("../../models/cases/CaseVictim");
const CaseSuspect = require("../../models/cases/CaseSuspect");
const CaseWitness = require("../../models/cases/CaseWitness");
const CaseOtherDetails = require("../../models/cases/CaseOtherDetails");
const CaseProgress = require("../../models/cases/CaseProgress");
const CaseEvidence = require("../../models/cases/CaseEvidence");
const CaseCategory = require("../../models/cases/CaseCategory");
const CaseTaggedCategories = require("../../models/cases/CaseTaggedCategories");
const PublicUser = require("../../models/PublicUser");
const { uploadEvidenceImages } = require("./cloudUpload");

const { tryCatchError, normalError } = require("../../utils/errorHandlers");
const {
  successWithData,
  successNoData,
} = require("../../utils/successHandler");

const _ = require("lodash");
const { uploadCaseAvatar } = require("./cloudUpload");

exports.followCase = async (req, res, next) => {
  try {
    const existingCase = await Case.findById(req.params.id);
    if (!existingCase) return normalError(res, 404, "Case not found", null);
    if (req.body.followStatus === "follow") {
      if (existingCase.followedBy.includes(req.user._id))
        return successNoData(res, 200, "You are following this case already");
      existingCase.followedBy.push(req.user);
      await existingCase.save();
      return successNoData(res, 200, "Case followed successfully");
    } else {
      if (!existingCase.followedBy.includes(req.user._id))
        return successNoData(res, 200, "You are already unfollowing this case");
      existingCase.followedBy.pop(req.user);
      await existingCase.save();
      return successNoData(res, 200, "Case unfollowed successfully");
    }
  } catch (err) {
    return tryCatchError(res, err);
  }
};

const getCategories = async (caseID) => {
  let categories = [];
  const cats = await CaseTaggedCategories.find({ caseID });
  for (let i = 0; i < cats.length; i++) {
    const category = await CaseCategory.findById(cats[i].caseCategoryID);
    categories.push(category.categoryName);
  }
  return categories;
};

exports.getFollowedCases = async (req, res, next) => {
  let categories = [];
  let followedCases = [];
  try {
    let { page = 1, limit = 20 } = req.query;
    const cases = await Case.find({
      followedBy: req.user,
    })
      .sort("-createdAt")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Case.countDocuments({
      followedBy: req.user._id,
    }).exec();
    for (let i = 0; i < cases.length; i++) {
      categories = await getCategories(cases[i]._id);
    }
    cases.map((c) => {
      const userFollowStatus = c.followedBy.includes(req.user._id);
      followedCases.push({
        ..._.pick(c, [
          "_id",
          "__v",
          "caseAvatar",
          "caseTitle",
          "categoryGroupID",
          "caseSummary",
          "datePublished",
          "publishedBy",
          "resolutionStatus",
          "reportType",
          "lga",
          "state",
          "country",
          "hourOfIncident",
          "categories",
          "caseTypeStatus",
        ]),
        userFollowStatus,
        categories,
      });
    });
    const data = {
      followedCases,
      total: Math.ceil(count / limit),
      page: parseInt(page),
    };
    return successWithData(res, 200, "Case Fetched Succesfully", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.assignPartnerToCase = async (req, res, next) => {
  try {
    const existingCase = await Case.findById(req.params.id);
    if (!existingCase) return normalError(res, 404, "Case not found", null);
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
  if (req.user.userType) {
    filter.state = req.user.stateOfAssignment;
    if (req.user.userType === "staff")
      filter.assignedPartnerUserId = req.user._id;
    filter.verificationStatus = "verified";
    if (req.user.userType === "verifier")
      filter.verificationStatus = "unVerified";
  }
  try {
    const cases = await Case.find(filter)
      .sort("-createdAt")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Case.countDocuments(filter).exec();
    const data = {
      cases: _.pick(cases, [
        "_id",
        "__v",
        "caseID",
        "categoryGroupID",
        "descriptionOfIncident",
        "dateOfIncident",
        "verificationStatus",
        "reportType",
        "platformOfReport",
        "state",
        "lga",
        "resolutionStatus",
        "createdAt",
      ]),
      total: Math.ceil(count / limit),
      page: parseInt(page),
    };
    return successWithData(res, 200, "cases fetched successfully", data);
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
    return successWithData(res, 200, "Cases Fetched successfully", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.createCase = async (req, res, next) => {
  try {
    const newCase = await Case.create({
      ...req.body,
      publicUserID: req.user._id,
      followedBy: [req.user.id],
    });
    const categories = req.body.categories.split(",");
    for (let i = 0; i < categories.length; i++) {
      await CaseTaggedCategories.create({
        caseCategoryID: categories[i],
        caseID: newCase._id,
      });
    }
    const data = {
      case: _.pick(newCase, ["_id", "caseID"]),
    };
    return successWithData(res, 200, "case created successfully", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.updateExistingCase = async (req, res, next) => {
  try {
    const existingCase = await Case.findById(req.params.id);
    if (!existingCase) return normalError(res, 404, "case not found!");
    const updatedCase = await Case.findByIdAndUpdate(
      existingCase._id,
      req.body,
      { new: true }
    );
    return successWithData(res, 200, "case updated successfully", updatedCase);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.createCaseVictim = async (req, res, next) => {
  try {
    const existingCase = await Case.findById(req.params.caseID);
    if (!existingCase) return normalError(res, 404, "case not found");
    req.body.caseID = req.params.caseID;
    req.body.addedBy = req.user._id;
    const newVictim = await CaseVictim.create(req.body);
    const data = {
      victim: newVictim,
    };
    return successWithData(res, 200, "victim created successfully", data);
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
    return successWithData(res, 200, "Suspect Created Succesfully", data);
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
    return successWithData(res, 200, "Witness Created Succesfully", data);
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
    return successWithData(res, 200, "More Details Updated Succesfully", data);
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
    return successWithData(res, 200, "Progress Saved Succesfully", data);
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
    return successNoData(res, 201, "evidence saved successfully");
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.getPersonalCases = async (req, res, next) => {
  let { page = 1, limit = 20 } = req.query;
  try {
    const cases = await Case.find({ publicUserID: req.user.id })
      .select(
        "caseAvatar caseID descriptionOfIncident categoryGroupID assignedPartnerUserId"
      )
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort("-createdAt")
      .exec();
    const count = await Case.countDocuments({
      publicUserID: req.user.id,
    });
    const data = {
      cases,
      total: Math.ceil(count / limit),
      page: parseInt(page),
    };
    return successWithData(res, 200, "Fetched personal cases", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.verifyCase = async (req, res, next) => {
  try {
    const existingCase = await Case.findById(req.params.id).select(
      "-followedBy -areYouTheVictim"
    );
    if (!existingCase) return normalError(res, 404, "Case does not exist");
    const updatedCase = await Case.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: req.body.verificationStatus },
      { new: true }
    );
    return successWithData(res, 200, "Case verified successfully", updatedCase);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.publishCase = async (req, res, next) => {
  try {
    const existingCase = await Case.findById(req.params.id);
    if (!existingCase) return normalError(res, 404, "Case does not exist");

    const publishedCase = await Case.findByIdAndUpdate(
      existingCase._id,
      {
        ...req.body,
        publishedBy: req.user,
        datePublished: new Date(Date.now()),
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
    if (!existingCase) return normalError(res, 404, "Case does not exist");

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

exports.getSinglePublicCase = async (req, res, next) => {
  let categories = [];
  let userFollowStatus;
  try {
    const existingCase = await Case.findById(req.params.id);
    const categoryIDs = await CaseTaggedCategories.find({
      caseID: existingCase._id,
    });
    for (let i = 0; i < categoryIDs.length; i++) {
      const category = await CaseCategory.findById(
        categoryIDs[i].caseCategoryID
      );
      categories.push(category.categoryName);
    }
    if (req.authorized) {
      const loggedInUser = await PublicUser.findById(req.user._id);
      userFollowStatus = existingCase.followedBy.includes(loggedInUser._id);
    }

    const data = {
      ..._.pick(existingCase, [
        "_id",
        "__v",
        "caseAvatar",
        "caseTitle",
        "categoryGroupID",
        "caseSummary",
        "datePublished",
        "dateOfIncident",
        "publishedBy",
        "resolutionStatus",
        "reportType",
        "state",
        "lga",
        "country",
        "caseTypeStatus",
        "hourOfIncident",
      ]),
      categories,
      userFollowStatus,
    };
    return successWithData(res, 200, "Fetched case", data);
  } catch (err) {}
};

exports.getPublicCases = async (req, res, next) => {
  const selectedFields = req.user
    ? "caseAvatar caseTitle publishedBy datePublished categoryGroupID caseSummary"
    : "caseAvatar caseTitle publishedBy datePublished categoryGroupID caseSummary";
  let { page = 1, limit = 20 } = req.query;
  const filter = _.pick(req.query, [
    "resolutionStatus",
    "reportType",
    "caseTypeStatus",
    "state",
    "lga",
  ]);
  // filter.verificationStatus = "verified";
  // filter.publishStatus = "published";
  try {
    const cases = await Case.find(filter)
      .sort("-createdAt")
      .select(selectedFields)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Case.countDocuments(filter).exec();
    const data = {
      cases,
      total: Math.ceil(count / limit),
      page: parseInt(page),
    };
    return successWithData(res, 200, "Cases Fetched Succesfully", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
};
