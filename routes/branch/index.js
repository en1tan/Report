const express = require("express");
const router = express.Router();

const authorize = require("../../middleware/authorization");
const controller = require("../../controllers/partner/branch");

router.post(
  "/:partnerID/create",
  authorize(["super-admin", "admin"]),
  controller.addBranchToPartnerOrganization
);
router.get(
  "/:partnerID/all",
  authorize(["super-admin", "admin"]),
  controller.listBranches
);
router.get("/:id", authorize(["super-admin", "admin"]), controller.fetchBranch);
router.patch(
  "/:id/update",
  authorize(["super-admin", "admin"]),
  controller.updatePartnerBranch
);
router.delete(
  "/:id/update",
  authorize(["super-admin", "admin"]),
  controller.deleteBranch
);

router.get(
  "/:id/users",
  authorize(["super-admin", "admin"]),
  controller.listUsers
);
