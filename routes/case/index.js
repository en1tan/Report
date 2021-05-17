const express = require("express");
// const authController = require('../../controllers/auth');
const caseController = require("../../controllers/case");
const uploadImage = require("../../middleware/imageUpload");
// const userController = require('../../controllers/users');

const authorize = require("../../middleware/authorization");
const caseRoute = require("./case");
const categoryRoute = require("./category");
const auth = require("../../middleware/authenticate");

const router = express.Router();

router.use("/", auth(), caseRoute);
router.use("/category", auth(), categoryRoute);

router.post(
  "/create/:caseID/caseVictim",
  authorize("admin"),
  caseController.createCaseVictim,
);
router.post(
  "/create/:caseID/caseSuspect",
  authorize("admin"),
  caseController.createCaseSuspect,
);
router.post(
  "/create/:caseID/caseWitness",
  authorize("admin"),
  caseController.createCaseWitness,
);
router.post(
  "/create/:caseID/otherDetails",
  authorize("admin"),
  caseController.createCaseOtherDetails,
);
router.post(
  "/create/:caseID/caseProgress",
  authorize("admin"),
  caseController.createCaseProgress,
);
router.patch(
  "/:id/evidence",
  authorize("admin"),
  uploadImage,
  caseController.saveEvidence,
);
router.patch(
  "/:id/case",
  authorize("admin"),
  caseController.editEvidence,
);

// router.post('/favourite', authorize, userController.favourite);

module.exports = router;
