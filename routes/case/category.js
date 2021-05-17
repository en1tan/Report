const express = require("express");
const caseController = require("../../controllers/case");
const authorize = require("../../middleware/authorization");

const router = express.Router();

router.get(
  "/groups",
  authorize(["super-admin", "admin"]),
  caseController.getAllCategoryGroup,
);
router.post(
  "/group/create",
  authorize("super-admin"),
  caseController.createCaseCategoryGroup,
);
router.post(
  "/group/:id/create",
  authorize("super-admin"),
  caseController.createCaseCategory,
);

module.exports = router;
