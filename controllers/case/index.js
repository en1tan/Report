const _ = require("lodash");

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
const PartnerUser = require("../../models/partners/PartnerUser");
const FollowCase = require("../../models/cases/FollowCase");

const { tryCatchError, normalError } = require("../../utils/errorHandlers");
const {
  successWithData,
  successNoData,
} = require("../../utils/successHandler");

exports.followCase = async (req, res, next) => {
  try {
    const follow = await FollowCase.findOne({ caseID: req.params.id });
    if (req.body.followStatus === "follow") {
      if (follow)
        return successNoData(res, 200, "You are following this case already");
      await FollowCase.create({
        caseID: req.params.id,
        publicUserID: req.user._id,
      });
      return successNoData(res, 200, "Case followed successfully");
    } else {
      if (!follow)
        return successNoData(res, 200, "You have unfollowed this case");
      await FollowCase.findOneAndDelete({
        caseID: req.params.id,
      });
      return successNoData(res, 200, "Case unfollowed successfully");
    }
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.getFollowedCases = async (req, res, next) => {
  let categories = [];
  let cases = [];
  const followedCases = [];
  let count;
  try {
    let { page = 1, limit = 20 } = req.query;
    const f = await FollowCase.find({ publicUserID: req.user._id });
    for (let i = 0; i < f.length; i++) {
      cases = await Case.find({ followedBy: f[i]._id })
        .sort("-createdAt")
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      count = await Case.countDocuments({
        followedBy: f[i]._id,
      }).exec();
    }

    for (let i = 0; i < cases.length; i++) {
      categories = await getCategories(cases[i]._id);
    }

    cases.map(async (c) => {
      const followStatus = c.followedBy.some(
        async (cf) => cf === (await FollowCase.findOne(cf._id))
      );
      const publisher = await PartnerUser.findById(c.publishedBy).select(
        "firstName middleName lastName"
      );
      followedCases.push({
        ..._.pick(c, [
          "_id",
          "__v",
          "caseAvatar",
          "caseTitle",
          "categoryGroupID",
          "caseSummary",
          "datePublished",
        ]),
        followStatus,
        categories,
        publisher,
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

const getCategories = async (caseID) => {
  let categories = [];
  const cats = await CaseTaggedCategories.find({ caseID });
  for (let i = 0; i < cats.length; i++) {
    const category = await CaseCategory.findById(cats[i].caseCategoryID);
    categories.push(category.categoryName);
  }
  return categories;
};

exports.assignPartnerToCase = async (req, res, next) => {
  try {
    const existingCase = await Case.findById(req.params.id);
    if (!existingCase) return normalError(res, 404, "Case not found", null);
    await Case.findByIdAndUpdate(
      existingCase._id,
      {
        assignedPartnerUserId: req.body.assignedPartnerUserId,
        caseTypeStatus: req.body.caseTypeStatus,
      },
      { new: true }
    );
    return successNoData(res, 200, "Admin assigned successfully");
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
  if (req.user.userType !== "super-admin")
    if (req.user.userType) {
      filter.state = req.user.stateOfAssignment;
      if (req.user.userType === "staff") {
        filter.verificationStatus = "verified";
        filter.assignedPartnerUserId = req.user._id;
      } else if (req.user.userType === "verifier")
        filter.verificationStatus = "unVerified";
    }
  try {
    const cases = await Case.find()
      .select(
        "caseID categoryGroupID descriptionOfIncident" +
          " dateOfIncident verificationStatus reportType" +
          " platformOfReort state lga resolutionStatus createdAt"
      )
      .sort("-createdAt")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Case.countDocuments(filter).exec();
    const data = {
      cases,
      total: Math.ceil(count / limit),
      page: parseInt(page),
    };
    return successWithData(res, 200, "Cases fetched successfully", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.getCase = async (req, res, next) => {
  try {
    let categories = [];
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
      categories = await getCategories(fetchedCase._id);
    }
    const data = {
      caseData: {
        case: { categories, fetchedCase },
        victim,
        witness,
        suspect,
      },
    };
    return successWithData(res, 200, "Case fetched successfully", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.createCase = async (req, res, next) => {
  try {
    const newCase = await Case.create({
      ...req.body,
      publicUserID: req.user,
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
    return successWithData(
      res,
      200,
      "Case file has been created successfully",
      data
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.updateExistingCase = async (req, res, next) => {
  try {
    const existingCase = await Case.findById(req.params.id);
    if (!existingCase) return normalError(res, 404, "Case not found!");
    const updatedCase = await Case.findByIdAndUpdate(
      existingCase._id,
      req.body,
      { new: true }
    );
    return successWithData(
      res,
      200,
      "Case file updated successfully",
      updatedCase
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
      "Witness has been successfully added to the case file",
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
      "Case conversation updated succesfully",
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
      "Progress report has been succesfully added to the case file",
      data
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.getCurrentCaseProgress = async (req, res) => {
  try {
    const existingCase = await Case.findById(req.params.caseID);
    if (!existingCase) return normalError(res, 404, "case not found");
    const currentProgress = await CaseProgress.find({
      caseID: existingCase._id,
    });
    return successWithData(res, 200, "current case progress", currentProgress);
  } catch (err) {
    return tryCatchError(res, err);
  }
};
/**
 * Save case evidence
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<{}>}
 */
exports.saveEvidence = async (req, res) => {
  try {
    req.body.caseID = req.params.id;
    await CaseEvidence.create(req.body);
    return successNoData(
      res,
      201,
      "Case evidence attached to case file successfully"
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

/**
 * Get case evidence
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<[]>}
 */
exports.getCaseEvidence = async (req, res) => {
  try {
    const existingCase = await Case.findById(req.params.caseID);
    if (!existingCase) return normalError(res, 404, "case not found");
    const evidence = await CaseEvidence.find({ caseID: req.params.caseID });
    return successWithData(res, 200, "evidence fetched", evidence);
  } catch (err) {
    return tryCatchError(res, err);
  }
};
/**
 * Fetch personal cases
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} next
 * @returns {Promise<[]>}
 */
exports.getPersonalCases = async (req, res, next) => {
  try {
    let { page = 1, limit = 20 } = req.query;
    let categories = [];
    let personalCases = [];
    const user = req.user ? req.user._id : "";
    const cases = await Case.find({ publicUserID: user })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort("-createdAt")
      .exec();
    const count = await Case.countDocuments({
      publicUserID: req.user.id,
    });
    for (let i = 0; i < cases.length; i++) {
      const categoryIDs = await CaseTaggedCategories.find({
        caseID: cases[i]._id,
      });
      for (let c = 0; c < categoryIDs.length; c++) {
        const category = await CaseCategory.findById(
          categoryIDs[c].caseCategoryID
        );
        categories.push(category.categoryName);
      }
      const userFollowStatus = await FollowCase.findOne({
        caseID: cases[i]._id,
      })
        .where("publicUserID")
        .in([user]);
      const assignedPartner = await PartnerUser.findById(
        cases[i].assignedPartnerUserId
      ).select("firstName middleName lastName");
      personalCases.push({
        ..._.pick(cases[i], [
          "caseAvatar",
          "caseID",
          "descriptionOfIncident",
          "categoryGroupID",
          "_id",
          "__v",
        ]),
        userFollowStatus: !!userFollowStatus,
        assignedPartner,
        categories,
      });
    }
    const data = {
      personalCases,
      total: Math.ceil(count / limit),
      page: parseInt(page),
    };
    return successWithData(res, 200, "Fetched personal cases", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

/**
 * Verify a case
 * @param {Express.Request} req
 * @param {Express.response} res
 * @param {*} next
 * @returns {Promise<{}>}
 */
exports.verifyCase = async (req, res, next) => {
  try {
    const existingCase = await Case.findById(req.params.id).select(
      "-followedBy -areYouTheVictim"
    );
    if (!existingCase) return normalError(res, 404, "Case does not exist");
    if (existingCase.verificationStatus === "verified")
      return successNoData(res, 200, "Case has already been verified");
    await Case.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: req.body.verificationStatus },
      { new: true }
    );
    return successNoData(res, 200, "Case has been verified successfully");
  } catch (err) {
    return tryCatchError(res, err);
  }
};

/**
 * Publish Case
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} next
 * @returns {Promise<{}>}
 */
exports.publishCase = async (req, res, next) => {
  try {
    const existingCase = await Case.findById(req.params.id);
    if (!existingCase) return normalError(res, 404, "Case does not exist");
    if (existingCase.publishStatus === req.body.publishStatus)
      return successWithData(
        res,
        200,
        "Case already has status: " + req.body.publishStatus
      );
    const publishedCase = await Case.findByIdAndUpdate(
      existingCase._id,
      {
        ...req.body,
        publishedBy: req.user,
        datePublished: new Date(Date.now()).toISOString(),
      },
      { new: true }
    ).select(
      "-followedBy -verificationStatus -resolutionStatus" +
        " -areYouTheVictim -assignedPartnerUserId"
    );
    return successWithData(
      res,
      200,
      "Case " + req.body.publishStatus + " successfully",
      publishedCase
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

/**
 * Resolve a case
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} next
 * @returns {Promise<{}>}
 */
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
      "This case has been resolved and closed successfully",
      resolvedCase
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

/**
 * Get a single public case
 * Also supports login status
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} next
 * @returns {Promise<{}>}
 */
exports.getSinglePublicCase = async (req, res, next) => {
  let categories = [];
  let userFollowStatus = false;
  try {
    const existingCase = await Case.findById(req.params.id);
    if (!existingCase) return normalError(res, 404, "Case not found");
    const categoryIDs = await CaseTaggedCategories.find({
      caseID: existingCase._id,
    });
    for (let i = 0; i < categoryIDs.length; i++) {
      const category = await CaseCategory.findById(
        categoryIDs[i].caseCategoryID
      );
      categories.push(category.categoryName);
    }
    const publisher = await PartnerUser.findById(
      existingCase.publishedBy
    ).select("firstName lastName middleName");
    if (req.authorized) {
      const loggedInUser = await PublicUser.findById(req.user._id);
      const f = await FollowCase.findOne({ publicUserID: loggedInUser._id })
        .where("caseID")
        .in([req.params.id]);
      userFollowStatus = existingCase.followedBy.includes(f._id);
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
      publisher,
    };
    return successWithData(res, 200, "Fetched case", data);
  } catch (err) {}
};

/**
 * Get public cases
 * Also supports log in status
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {*} next
 * @returns {Promise<[]>}
 */
exports.getPublicCases = async (req, res, next) => {
  const publicCases = [];
  const selectedFields = req.user
    ? "_id __v caseAvatar caseTitle datePublished categoryGroupID" +
      " caseSummary"
    : "_id __v caseAvatar caseTitle datePublished categoryGroupID" +
      " caseSummary";
  let { page = 1, limit = 20 } = req.query;
  const filter = _.pick(req.query, [
    "resolutionStatus",
    "reportType",
    "caseTypeStatus",
    "state",
    "lga",
  ]);
  filter.verificationStatus = "verified";
  filter.publishStatus = "published";
  try {
    const cases = await Case.find(filter)
      .sort("-createdAt")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Case.countDocuments(filter).exec();
    for (let i = 0; i < cases.length; i++) {
      const user = req.user ? req.user._id : null;
      const userFollowStatus = await FollowCase.findOne({
        caseID: cases[i]._id,
      })
        .where("publicUserID")
        .in([user]);
      const publicCase = {
        ..._.pick(cases[i], selectedFields.split(" ")),
        publisher: await PartnerUser.findById(cases[i].publishedBy).select(
          "firstName lastName middleName"
        ),
        followStatus: !!userFollowStatus,
      };
      publicCases.push(publicCase);
    }
    const data = {
      publicCases,
      total: Math.ceil(count / limit),
      page: parseInt(page),
    };
    return successWithData(res, 200, "Cases fetched Succesfully", data);
  } catch (err) {
    return tryCatchError(res, err);
  }
};
