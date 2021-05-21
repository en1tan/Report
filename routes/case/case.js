const express = require("express");
const caseController = require("../../controllers/case");
const authorize = require("../../middleware/authorization");
const { arrayUpload } = require("../../middleware/imageUpload");

const router = express.Router();

router.get(
  "/",
  authorize(["super-admin", "admin", "staff", "verifier"]),
  caseController.getAllCase,
);
router.get("/personal", caseController.getPersonalCases);
router.post("/create", caseController.createCase);
router.get("/followed", caseController.getFollowedCases);
router.get(
  "/:id",
  authorize(["super-admin", "admin", "staff", "verifier"]),
  caseController.getCase,
);

router.post(
  "/create/:caseID/caseVictim",
  authorize(["public", "admin", "staff"]),
  caseController.createCaseVictim,
);
router.post(
  "/create/:caseID/caseSuspect",
  authorize(["public", "admin", "staff"]),
  caseController.createCaseSuspect,
);
router.post(
  "/create/:caseID/caseWitness",
  authorize(["public", "admin", "staff"]),
  caseController.createCaseWitness,
);
router.post(
  "/create/:caseID/otherDetails",
  authorize("admin"),
  caseController.createCaseOtherDetails,
);
router.post(
  "/create/:caseID/caseProgress",
  authorize(["public", "admin", "staff"]),
  caseController.createCaseProgress,
);

router.patch(
  "/:id/evidence",
  arrayUpload,
  caseController.saveEvidence,
);
router.patch(
  "/:id/case",
  authorize(["admin", "staff"]),
  caseController.editEvidence,
);

router.patch(
  "/:id/assign",
  authorize("admin"),
  caseController.assignPartnerToCase,
);

router.patch(
  "/:id/verify",
  authorize(["super-admin", "verifier"]),
  caseController.verifyCase,
);

router.patch(
  "/:id/publish",
  authorize(["admin", "staff"]),
  caseController.publishCase,
);
router.patch(
  "/:id/resolve",
  authorize(["admin", "staff"]),
  caseController.resolveCase,
);
router.patch("/:id/follow", caseController.followCase);

module.exports = router;
