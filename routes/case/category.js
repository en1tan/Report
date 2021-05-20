const express = require("express");
const caseController = require("../../controllers/case");
const authorize = require("../../middleware/authorization");
const { singleUpload } = require("../../middleware/imageUpload");

const router = express.Router();

router.get(
  "/groups",
  authorize(["super-admin", "admin"]),
  caseController.getAllCategoryGroup,
);
router.post(
  "/group/create",
  authorize("admin"),
  singleUpload,
  caseController.createCaseCategoryGroup,
);
router.post(
  "/group/:id/create",
  authorize("admin"),
  caseController.createCaseCategory,
);

module.exports = router;
