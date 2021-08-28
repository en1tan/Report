const _ = require('lodash');

const Case = require('../../models/cases/Case');
const CaseVictim = require('../../models/cases/CaseVictim');
const CaseSuspect = require('../../models/cases/CaseSuspect');
const CaseWitness = require('../../models/cases/CaseWitness');
const CaseOtherDetails = require('../../models/cases/CaseOtherDetails');
const CaseEvidence = require('../../models/cases/CaseEvidence');
const CaseGroupCategory = require('../../models/cases/CaseCategoryGroup');
const CaseCategory = require('../../models/cases/CaseCategory');
const CaseTaggedCategories = require('../../models/cases/CaseTaggedCategories');
const PartnerUser = require('../../models/partners/PartnerUser');
const FollowCase = require('../../models/cases/FollowCase');

const { tryCatchError, normalError } = require('../../utils/errorHandlers');
const {
  successWithData,
  successNoData,
} = require('../../utils/successHandler');

/**
 * Follow a case
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<*>}
 */
exports.followCase = async (req, res) => {
  try {
    const existingCase = await Case.findById(req.params.id);
    if (!existingCase) return normalError(res, 404, 'case not found');
    const follow = await FollowCase.findOne({
      caseID: req.params.id,
      publicUserID: req.user._id,
    });
    if (req.body.followStatus === 'follow') {
      if (follow)
        return successNoData(res, 200, 'You are following this case already');
      await FollowCase.create({
        caseID: req.params.id,
        publicUserID: req.user._id,
      });
      return successNoData(res, 200, 'Case followed successfully');
    } else {
      if (!follow)
        return successNoData(res, 200, 'You have unfollowed this case');
      await FollowCase.findOneAndDelete({
        caseID: req.params.id,
      });
      return successNoData(res, 200, 'Case unfollowed successfully');
    }
  } catch (err) {
    return tryCatchError(res, err);
  }
};

/**
 * Get followed cases
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<*>}
 */
exports.getFollowedCases = async (req, res) => {
  let categories = [];
  let cases = [];
  const followedCases = [];
  let count;
  try {
    let { page = 1, limit = 20 } = req.query;
    const f = await FollowCase.find({ publicUserID: req.user._id });
    const c = [];
    for (let i = 0; i < f.length; i++) {
      c.push(f[i].caseID);
      cases = await Case.find()
        .where('_id')
        .in(c)
        .sort('-createdAt')
        .limit(limit * 1)
        .skip(((page < 1 ? 1 : page) - 1) * limit)
        .exec();
      count = await Case.countDocuments().where('_id').in(c).exec();
    }

    for (let i = 0; i < cases.length; i++) {
      categories = await getCategories(cases[i]._id);
      const followStatus = cases[i].followedBy.some(
        async (cf) => cf === (await FollowCase.findOne(cf._id))
      );
      const publisher = await PartnerUser.findById(cases[i].publishedBy).select(
        'firstName middleName lastName'
      );
      const group = await CaseGroupCategory.findById(cases[i].categoryGroupID);
      followedCases.push({
        ..._.pick(cases[i], [
          '_id',
          '__v',
          'caseAvatar',
          'caseTitle',
          'caseSummary',
          'datePublished',
          'caseTypeStatus',
        ]),
        followStatus,
        categories,
        publisher,
        groupName: group ? group.groupName : '',
      });
    }
    const data = {
      followedCases,
      totalCases: count,
      total: Math.ceil(count / limit),
      page: parseInt(page),
    };
    return successWithData(res, 200, 'Case Fetched Succesfully', data);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

/**
 * Get case categories
 * @param {string} caseID
 * @returns {Promise<[CaseTaggedCategories]>}
 */
const getCategories = async (caseID) => {
  let categories = [];
  const cats = await CaseTaggedCategories.find({ caseID });
  for (let i = 0; i < cats.length; i++) {
    const category = await CaseCategory.findById(cats[i].caseCategoryID);
    if (category) categories.push(category.categoryName);
  }
  return categories;
};

/**
 * Assign partner to case
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Case>}
 */
exports.assignPartnerToCase = async (req, res) => {
  try {
    const existingCase = await Case.findById(req.params.id);
    if (!existingCase) return normalError(res, 404, 'Case not found', null);
    await Case.findByIdAndUpdate(
      existingCase._id,
      {
        assignedPartnerUserId: req.body.assignedPartnerUserId,
        caseTypeStatus: req.body.caseTypeStatus,
      },
      { new: true }
    );
    return successNoData(res, 200, 'Admin assigned successfully');
  } catch (err) {
    return tryCatchError(res, err);
  }
};

/**
 * Get all cases for admin users
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<[Case]>}
 */
exports.getAllCase = async (req, res) => {
  let { page = 1, limit = 20 } = req.query;
  const filter = _.pick(req.query, [
    'resolutionStatus',
    'verificationStatus',
    'platformOfReport',
    'publishStatus',
    'reportType',
    'caseTypeStatus',
  ]);
  filter.state = req.user.userType
    ? req.user.userType !== 'super-admin'
      ? req.user.stateOfAssignment
      : null
    : null;
  if (req.user.userType === 'staff') {
    filter.verificationStatus = 'verified';
    filter.assignedPartnerUserId = req.user._id;
  } else if (req.user.userType === 'verifier') {
    filter.verificationStatus = 'unVerified';
    filter.reportType = 'Standard';
    filter.publishStatus = 'unPublished';
  }
  try {
    const cases = await Case.find()
      .select(
        'caseID categoryGroupID descriptionOfIncident' +
          ' dateOfIncident verificationStatus reportType' +
          ' platformOfReort state lga resolutionStatus createdAt' +
          ' caseTypeStatus'
      )
      .sort('-createdAt')
      .limit(limit * 1)
      .skip(((page < 1 ? 1 : page) - 1) * limit)
      .exec();
    const count = await Case.countDocuments(filter).exec();
    const data = {
      cases,
      total: Math.ceil(count / limit),
      page: parseInt(page),
    };
    return successWithData(res, 200, 'Cases fetched successfully', data);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

/**
 * Get a single case for admin user
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Case>}
 */
exports.getCase = async (req, res) => {
  try {
    let categories = [];
    let group;
    const fetchedCase = await Case.findById(req.params.id);
    if (!fetchedCase) return normalError(res, 404, 'Case not found');
    let witness;
    let victim;
    let suspect;
    if (fetchedCase) {
      witness = await CaseWitness.findOne({
        caseID: req.params.id,
      }).select('firstNameOfWitness middleNameOfWitness lastNameOfWitness');
      victim = await CaseVictim.findOne({
        caseID: req.params.id,
      }).select('firstNameOfVictim middleNameOfVictim lastNameOfVictim');
      suspect = await CaseSuspect.findOne({
        caseID: req.params.id,
      }).select('firstNameOfSuspect middleNameOfSuspect lastNameOfSuspect');
      group = await CaseGroupCategory.findById(fetchedCase.categoryGroupID);
      categories = await getCategories(fetchedCase._id);
    }
    const data = {
      caseData: {
        case: {
          ..._.pick(fetchedCase, [
            '_id',
            '__v',
            'caseTitle',
            'platformOfReport',
            'verificationStatus',
            'resolutionStatus',
            'datePublished',
            'publishedBy',
            'caseSummary',
            'caseTypeStatus',
            'casePleas',
            'reportType',
            'descriptionOfIncident',
            'lga',
            'state',
            'country',
            'hourOfIncident',
            'dateOfIncident',
            'addressLandmark',
            'addressOfIncident',
            'assignedPartnerUserId',
            'caseAvatar',
            'publicUserID',
            'caseID',
          ]),
          categories,
          groupName: group ? group.groupName : '',
        },
        victim,
        witness,
        suspect,
      },
    };
    return successWithData(res, 200, 'Case fetched successfully', data);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

/**
 * Create a case
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Case>}
 */
exports.createCase = async (req, res) => {
  try {
    req.body.publicUserID = req.user._id;
    req.body.caseTypeStatus =
      req.body.reportType === 'QuickReport' ? req.body.reportType : 'Incidence';
    req.body.resolutionStatus =
      req.body.reportType === 'QuickReport' ? 'onlyReport' : 'unResolved';
    req.body.verificationStatus =
      req.body.reportType === 'QuickReport' ? 'onlyReport' : 'unVerified';
    const newCase = await Case.create(req.body);
    const categories = req.body.categories.split(',');
    for (let i = 0; i < categories.length; i++) {
      await CaseTaggedCategories.create({
        caseCategoryID: categories[i],
        caseID: newCase._id,
      });
    }
    const data = {
      case: _.pick(newCase, ['_id', 'caseID']),
    };
    return successWithData(
      res,
      200,
      'Case file has been created successfully',
      data
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

/**
 * Update an existing case
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Case>}
 */
exports.updateExistingCase = async (req, res) => {
  try {
    const existingCase = await Case.findById(req.params.id);
    if (!existingCase)
      return normalError(res, 404, 'Case not found!', existingCase);
    if (existingCase.publishStatus === 'published' && !req.user.userType)
      return normalError(res, 100, 'published case cannot be edited', null);
    const updatedCase = await Case.findByIdAndUpdate(
      existingCase._id,
      req.body,
      { new: true }
    );
    return successWithData(
      res,
      200,
      'Case file updated successfully',
      updatedCase
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

/**
 * Create a case witness
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<CaseWitness>}
 */

/**
 * Create other details to
 * a case
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<{CaseOtherDetails}>}
 */
exports.createCaseOtherDetails = async (req, res) => {
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
      'Case conversation updated succesfully',
      data
    );
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
    req.body.publicUser = req.user;
    await CaseEvidence.create(req.body);
    return successNoData(
      res,
      201,
      'Case evidence attached to case file successfully'
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
    if (!existingCase)
      return normalError(res, 404, 'case not found', existingCase);
    if (req.user._id.toString() === existingCase.publicUserID.toString()) {
      const evidence = await CaseEvidence.find({
        caseID: req.params.caseID,
      });
      return successWithData(res, 200, 'evidence fetched', evidence);
    } else {
      return normalError(res, 404, 'Resource not found');
    }
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.deleteCaseEvidence = async (req, res) => {
  try {
    const evidence = await CaseEvidence.findById(req.params.id);
    if (!evidence) return normalError(res, 404, 'evidence file not found');
    await CaseEvidence.findByIdAndDelete(evidence._id);
    return successNoData(res, 200, 'evidence deleted successfully');
  } catch (err) {
    return tryCatchError(res, err);
  }
};

/**
 * Fetch personal cases
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<[]>}
 */
exports.getPersonalCases = async (req, res) => {
  try {
    let { page = 1, limit = 20 } = req.query;
    let categories = [];
    let personalCases = [];
    const user = req.user ? req.user._id : '';
    const cases = await Case.find({ publicUserID: user })
      .limit(limit * 1)
      .skip(((page < 1 ? 1 : page) - 1) * limit)
      .sort('-createdAt')
      .exec();
    const count = await Case.countDocuments({
      publicUserID: req.user.id,
    });
    for (let i = 0; i < cases.length; i++) {
      categories = await getCategories(cases[i]._id);
      const group = await CaseGroupCategory.findById(cases[i].categoryGroupID);
      const assignedPartner = await PartnerUser.findById(
        cases[i].assignedPartnerUserId
      ).select('firstName middleName lastName');
      personalCases.push({
        ..._.pick(cases[i], [
          'caseAvatar',
          'caseID',
          'descriptionOfIncident',
          'caseTypeStatus',
          'publishStatus',
          'reportType',
          '_id',
          '__v',
        ]),
        groupName: group ? group.groupName : '',
        assignedPartner: assignedPartner ? assignedPartner : 'NotYetAssigned',
        categories,
      });
    }
    const data = {
      personalCases,
      totalCases: count,
      total: Math.ceil(count / limit),
      page: parseInt(page),
    };
    return successWithData(res, 200, 'Fetched personal cases', data);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

/**
 * Verify a case
 * @param {Express.Request} req
 * @param {Express.response} res
 * @returns {Promise<{}>}
 */
exports.verifyCase = async (req, res) => {
  try {
    const existingCase = await Case.findById(req.params.id).select(
      '-followedBy -areYouTheVictim'
    );
    if (!existingCase) return normalError(res, 404, 'Case does not exist');
    if (existingCase.verificationStatus === 'verified')
      return successNoData(res, 200, 'Case has already been verified');
    await Case.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: req.body.verificationStatus },
      { new: true }
    );
    return successNoData(res, 200, 'Case has been verified successfully');
  } catch (err) {
    return tryCatchError(res, err);
  }
};

/**
 * Get details of a published case
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Case>}
 */
exports.getPublishedCase = async (req, res) => {
  try {
    const existingCase = await Case.findById(req.params.id)
      .where('publishStatus')
      .in(['published']);
    if (!existingCase) return normalError(res, 404, 'Case does not exist');
    const publishedCase = await Case.findById(existingCase._id).select(
      'caseSummary caseTitle caseAvatar publishStatus'
    );
    return successWithData(res, 200, 'published case details', publishedCase);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

/**
 * Publish Case
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<{}>}
 */
exports.publishCase = async (req, res) => {
  try {
    const existingCase = await Case.findById(req.params.id);
    if (!existingCase) return normalError(res, 404, 'Case does not exist');
    if (existingCase.publishStatus === req.body.publishStatus)
      return successNoData(
        res,
        200,
        'Case already has status: ' + req.body.publishStatus
      );
    const datePublished =
      existingCase.publishStatus === 'published'
        ? existingCase.datePublished
        : new Date(Date.now()).toISOString();

    const publishedCase = await Case.findByIdAndUpdate(
      existingCase._id,
      {
        ...req.body,
        publishedBy: req.user,
        datePublished,
      },
      { new: true }
    ).select(
      '-followedBy -verificationStatus -resolutionStatus' +
        ' -areYouTheVictim -assignedPartnerUserId'
    );

    if (publishedCase.publishStatus === 'published') {
      const follow = await FollowCase.create({
        caseID: publishedCase._id,
        publicUserID: publishedCase.publicUserID,
      });
    }
    return successWithData(
      res,
      200,
      'Case ' + req.body.publishStatus + ' successfully',
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
 * @returns {Promise<{}>}
 */
exports.resolveCase = async (req, res) => {
  try {
    const existingCase = await Case.findById(req.params.id);
    if (!existingCase)
      return normalError(res, 404, 'Case does not exist', existingCase);

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
      'This case has been resolved and closed successfully',
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
 * @returns {Promise<{}>}
 */
exports.getSinglePublicCase = async (req, res) => {
  let categories = [];
  let userFollowStatus;
  try {
    const existingCase = await Case.findById(req.params.id);
    if (!existingCase) return normalError(res, 404, 'Case not found');
    const group = await CaseGroupCategory.findById(
      existingCase.categoryGroupID
    );
    const publisher = await PartnerUser.findById(
      existingCase.publishedBy
    ).select('firstName lastName middleName');
    if (req.authorized) {
      const f = await FollowCase.findOne({
        publicUserID: req.user._id,
        caseID: req.params.id,
      });
      userFollowStatus = !!f;
    }
    const data = {
      ..._.pick(existingCase, [
        '_id',
        '__v',
        'caseAvatar',
        'caseTitle',
        'caseSummary',
        'datePublished',
        'dateOfIncident',
        'publishStatus',
        'resolutionStatus',
        'reportType',
        'state',
        'lga',
        'country',
        'caseTypeStatus',
        'hourOfIncident',
      ]),
      groupName: group ? group.groupName : '',
      categories,
      userFollowStatus,
      publisher,
    };
    return successWithData(res, 200, 'Fetched Public case', data);
  } catch (err) {
    return tryCatchError(res, err);
  }
};

/**
 * Get public cases
 * Also supports log in status
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<[]>}
 */
exports.getPublicCases = async (req, res) => {
  const publicCases = [];
  const selectedFields = req.user
    ? '_id __v caseAvatar caseTitle caseTypeStatus datePublished categoryGroupID' +
      ' caseSummary reportType'
    : '_id __v caseAvatar caseTitle caseTypeStatus datePublished categoryGroupID' +
      ' caseSummary reportType';
  let { page = 1, limit = 20 } = req.query;
  const filter = _.pick(req.query, [
    'resolutionStatus',
    'reportType',
    'caseTypeStatus',
    'state',
    'lga',
  ]);
  filter.publishStatus = 'published';
  try {
    const cases = await Case.find({
      caseTitle: { $regex: new RegExp(req.query.search, 'i') },
      ...filter,
    })
      .sort('-datePublished')
      .limit(limit * 1)
      .skip(((page < 1 ? 1 : page) - 1) * limit)
      .exec();
    const count = await Case.countDocuments(filter).exec();
    for (let i = 0; i < cases.length; i++) {
      const user = req.user ? req.user._id : null;
      const userFollowStatus = await FollowCase.findOne({
        caseID: cases[i]._id,
      })
        .where('publicUserID')
        .in([user]);
      const group = await CaseGroupCategory.findById(cases[i].categoryGroupID);
      const publicCase = {
        ..._.pick(cases[i], selectedFields.split(' ')),
        publisher: await PartnerUser.findById(cases[i].publishedBy).select(
          'firstName lastName middleName'
        ),
        followStatus: !!userFollowStatus,
        groupName: group ? group.groupName : '',
      };
      publicCases.push(publicCase);
    }
    const data = {
      publicCases,
      total: Math.ceil(count / limit),
      page: parseInt(page),
    };
    return successWithData(res, 200, 'Cases fetched Successfully', data);
  } catch (err) {
    return tryCatchError(res, err);
  }
};
