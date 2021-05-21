const CaseCategoryGroup = require("../../models/cases/CaseCategoryGroup");
const CaseCategory = require("../../models/cases/CaseCategory");
const {
  uploadCaseCategoryGroupImages,
} = require("../case/cloudUpload");
const {
  successWithData,
  successNoData,
} = require("../../utils/successHandler");
const {
  tryCatchError,
  normalError,
} = require("../../utils/errorHandlers");

exports.getAllCategoryGroup = async (req, res, next) => {
  try {
    const groups = await CaseCategoryGroup.find().sort("-createdAt");
    return successWithData(
      res,
      200,
      "Fetched all category groups",
      groups,
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.createCaseCategoryGroup = async (req, res, next) => {
  try {
    const imageIcon = await uploadCaseCategoryGroupImages(req.file);
    req.body.imageIcon = imageIcon.url;
    const newGroup = await CaseCategoryGroup.create(req.body);
    const data = {
      group: newGroup,
    };
    return successWithData(
      res,
      201,
      "Case Group Created Succesfully",
      data,
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.editCaseCategoryGroup = async (req, res, next) => {
  try {
    const updatedCase = await CaseCategoryGroup.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    ).orFail();
    return successWithData(
      res,
      200,
      "Case Group updated successfully",
      updatedCase,
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.deleteCaseCategoryGroup = async (req, res, next) => {
  try {
    await CaseCategoryGroup.findByIdAndDelete(req.params.id).orFail();
    return successNoData(res, 200, "Case Group deleted successfully");
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    let filter = {};
    if (req.query.groupId) filter.categoryGroupID = req.query.groupId;
    const categories = await CaseCategory.find(filter);
    return successWithData(
      res,
      200,
      "Categories fetched",
      categories,
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.createCaseCategory = async (req, res, next) => {
  try {
    const newCategory = await CaseCategory.create({
      ...req.body,
      categoryGroupID: req.params.id,
    });
    const data = {
      category: newCategory,
    };
    return successWithData(
      res,
      200,
      "Case Category Created Succesfully",
      data,
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.editCaseCategory = async (req, res, next) => {
  try {
    const existingCase = await CaseCategory.findById(req.params.id);
    if (!existingCase)
      return normalError(res, 404, "Category not found", null);
    const updatedCategory = await CaseCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    return successWithData(
      res,
      200,
      "Category updated successfully.",
      updatedCategory,
    );
  } catch (err) {
    return tryCatchError(res, err);
  }
};

exports.deleteCaseCategory = async (req, res, next) => {
  try {
    await CaseCategory.findByIdAndDelete(req.params.id).orFail();
    return successNoData(res, 200, "Category deleted successfully");
  } catch (err) {
    return tryCatchError(res, err);
  }
};
