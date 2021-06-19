const express = require("express");
const progressController = require("../../controllers/progress");
const auth = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorization");

const router = express.Router();

router.post(
  "/create/:caseID",
  auth(true),
  authorize(["admin", "staff"]),
  progressController.createProgress
);

router.get("/:caseID", auth(true), progressController.getCurrentProgress);
router.patch(
  "/:id/update",
  auth(true),
  authorize(["admin", "staff"]),
  progressController.editCaseProgress
);
router.delete(
  "/:id/delete",
  auth(true),
  authorize(["admin", "staff"]),
  progressController.deleteProgress
);

module.exports = router;
