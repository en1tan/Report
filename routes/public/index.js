const express = require("express");
const router = express.Router();
const caseController = require("../../controllers/case");
const categoryController = require("../../controllers/category");
const auth = require("../../middleware/authenticate");

router.get("/cases/:id", auth(), caseController.getSinglePublicCase);
router.get("/cases", auth(), caseController.getPublicCases);
router.get("/category/groups", categoryController.getAllCategoryGroup);
router.get("/group/:groupID/categories", categoryController.getAllCategories);
module.exports = router;
