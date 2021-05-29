const express = require("express");
const router = express.Router();

const authorize = require("../../middleware/authorization");
const auth = require("../../middleware/authenticate");
const validator = require("../../utils/validator");
const partnerAuthController = require("../../controllers/auth/partnerUser");
const partnerController = require("../../controllers/partner");

router.get(
  "/:id/users",
  auth(),
  authorize(["super-admin", "admin"]),
  partnerController.getAllStaff
);
router.patch(
  "/user/:id/update",
  auth(),
  authorize(["super-admin", "admin"]),
  partnerController.editStaff
);
router.delete(
  "/user/:id",
  auth(),
  authorize(["super-admin", "admin"]),
  partnerController.deleteStaff
);

router.post(
  "/create",
  auth(),
  authorize(["super-admin"]),
  partnerController.createPartnerOrganization
);
router.post(
  "/:id/branch/create",
  auth(),
  authorize(["super-admin", "admin"]),
  partnerController.addBranchToPartnerOrganization
);

router.post(
  "/signup",
  validator("partnerSignup", "body"),
  partnerAuthController.signup
);

router.post(
  "/login",
  validator("login", "body"),
  partnerAuthController.signin
);

router.get("/profile", auth(), partnerAuthController.partnerProfile);

router.patch(
  "/partner/account",
  auth(),
  partnerAuthController.editAccount
);

module.exports = router;
