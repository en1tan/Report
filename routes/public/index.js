const express = require("express");
const router = express.Router();
const caseController = require("../../controllers/case");
const categoryController = require("../../controllers/category");

router.get("/cases/:id", caseController.getSinglePublicCase);
router.get("/cases", caseController.getPublicCases);
router.get("/category/groups", categoryController.getAllCategoryGroup);
router.get("/group/:groupID/categories", categoryController.getAllCategories);
module.exports = router;
