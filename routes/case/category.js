const express = require("express");
const categoryController = require("../../controllers/category");
const authorize = require("../../middleware/authorization");

const router = express.Router();

router.get("/groups", categoryController.getAllCategoryGroup);
router.post(
  "/group/create",
  authorize(["super-admin", "admin"]),
  categoryController.createCaseCategoryGroup,
);
router.patch(
  "/group/:id/update",
  authorize(["super-admin", "admin"]),
  categoryController.editCaseCategoryGroup,
);
router.delete(
  "/group/:id",
  authorize(["super-admin", "admin"]),
  categoryController.deleteCaseCategoryGroup,
);

router.get(
  "/:groupID/categories",
  categoryController.getAllCategories,
);

router.post(
  "/group/:id/create",
  categoryController.createCaseCategory,
  authorize(["super-admin", "admin"]),
);

router.patch(
  "/:id/update",
  authorize(["super-admin", "admin"]),
  categoryController.editCaseCategory,
);

router.delete(
  "/:id",
  authorize(["super-admin", "admin"]),
  categoryController.deleteCaseCategory,
);
module.exports = router;
