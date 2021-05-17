const express = require("express");
const caseController = require("../../controllers/case");
const authorize = require("../../middleware/authorization");
const uploadImage = require("../../middleware/imageUpload");

const router = express.Router();

router.get("/", authorize("admin"), caseController.getAllCase);
router.get("/personal", caseController.getPersonalCases);
router.post("/create", caseController.createCase);
router.get("/:id", authorize("admin"), caseController.getCase);

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

module.exports = router;
