const express = require("express");
const caseController = require("../../controllers/case");
const authorize = require("../../middleware/authorization");
const router = express.Router();

router.post("/create", caseController.createCase);
router.get(
  "/",
  authorize(["super-admin", "admin", "staff", "verifier"]),
  caseController.getAllCase
);
router.get("/personal", caseController.getPersonalCases);
router.patch("/:id/update", caseController.updateExistingCase);
router.get("/followed", caseController.getFollowedCases);
router.get("/:id", caseController.getCase);

router.post("/create/:caseID/caseWitness", caseController.createCaseWitness);
router.post(
  "/create/:caseID/otherDetails",
  authorize("admin"),
  caseController.createCaseOtherDetails
);
router.post(
  "/create/:caseID/caseProgress",
  authorize(["admin", "staff"]),
  caseController.createCaseProgress
);

router.get(
  "/:caseID/caseProgress",
  authorize(["admin", "staff"]),
  caseController.getCurrentCaseProgress
);

router.post(
  "/create/:id/evidence",
  authorize(["admin", "staff"]),
  caseController.saveEvidence
);

router.get(
  "/:caseID/evidence",
  authorize(["admin", "staff"]),
  caseController.getCaseEvidence
);

router.patch(
  "/:id/assign",
  authorize(["admin"]),
  caseController.assignPartnerToCase
);

router.patch(
  "/:id/verify",
  authorize(["admin", "verifier"]),
  caseController.verifyCase
);

router.patch(
  "/:id/publish",
  authorize(["admin", "staff"]),
  caseController.publishCase
);
router.patch(
  "/:id/resolve",
  authorize(["admin", "staff"]),
  caseController.resolveCase
);
router.patch("/:id/follow", caseController.followCase);

module.exports = router;
