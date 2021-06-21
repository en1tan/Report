const express = require("express");
const caseController = require("../../controllers/case");
const authorize = require("../../middleware/authorization");
const router = express.Router();

router.post("/create", caseController.createCase);
router.get(
  "/all",
  authorize(["super-admin", "admin", "staff", "verifier"]),
  caseController.getAllCase
);
router.get("/personal", caseController.getPersonalCases);
router.patch("/:id/update", caseController.updateExistingCase);
router.get("/followed", caseController.getFollowedCases);
router.get("/:id", caseController.getCase);

router.post(
  "/create/:caseID/otherDetails",
  authorize("admin"),
  caseController.createCaseOtherDetails
);

router.post("/create/:id/evidence", caseController.saveEvidence);

router.get("/:caseID/evidence", caseController.getCaseEvidence);

router.delete("/evidence/:id/delete", caseController.deleteCaseEvidence);

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
