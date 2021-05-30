const express = require("express");
const caseController = require("../../controllers/category");
const authorize = require("../../middleware/authorization");
const { singleUpload } = require("../../middleware/imageUpload");

const router = express.Router();

router.get("/groups", caseController.getAllCategoryGroup);
router.post(
  "/group/create",
  authorize(["super-admin", "admin"]),
  singleUpload,
  caseController.createCaseCategoryGroup
);
router.patch(
  "/group/:id/update",
  authorize(["super-admin", "admin"]),
  caseController.editCaseCategoryGroup
);
router.delete(
  "/group/:id",
  authorize(["super-admin", "admin"]),
  caseController.deleteCaseCategoryGroup
);

router.get("/:groupID/categories", caseController.getAllCategories);

router.post(
  "/group/:id/create",
  caseController.createCaseCategory,
  authorize(["super-admin", "admin"])
);

router.patch(
  "/:id/update",
  authorize(["super-admin", "admin"]),
  caseController.editCaseCategory
);

router.delete(
  "/:id",
  authorize(["super-admin", "admin"]),
  caseController.deleteCaseCategory
);
module.exports = router;
