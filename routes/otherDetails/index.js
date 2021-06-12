const express = require("express");
const otherDetailsController = require("../../controllers/otherDetails");
const auth = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorization");

const router = express.Router();

router.post(
  "/create/:caseID",
  auth(true),
  otherDetailsController.createOtherDetails
);
router.post(
  "/upload/:otherDetailsId",
  auth(true),
  otherDetailsController.uploadOtherDetailsDoc
);

module.exports = router;
