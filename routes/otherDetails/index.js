const express = require("express");
const otherDetailsController = require("../../controllers/otherDetails");
const auth = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorization");

const router = express.Router();

router.post(
  "/create/:caseId",
  auth(),
  authorize(["admin", "staff"]),
  otherDetailsController.createOtherDetails,
);
router.post(
  "/upload/:otherDetailsId",
  auth(),
  authorize(["admin", "staff"]),
  otherDetailsController.uploadOtherDetailsDoc,
);

module.exports = router;
