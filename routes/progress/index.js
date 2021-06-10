const express = require("express");
const progressController = require("../../controllers/progress");
const auth = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorization");

const router = express.Router();

router.post(
  "/create/:caseID",
  auth(),
  authorize(["admin", "staff"]),
  progressController.createProgress
);
router.post(
  "/upload/:progressId",
  auth(),
  authorize(["admin", "staff"]),
  progressController.uploadProgressDoc
);

module.exports = router;
