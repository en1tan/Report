const express = require("express");
const router = express.Router();

const authorize = require("../../middleware/authorization");
const auth = require("../../middleware/authenticate");
const validator = require("../../utils/validator");
const partnerAuthController = require("../../controllers/auth/partnerUser");
const partnerController = require("../../controllers/partner");
const partnerUserController = require("../../controllers/partner/user");

router.post(
  "/signup",
  validator("partnerSignup", "body"),
  partnerAuthController.signup
);

router.post("/login", validator("login", "body"), partnerAuthController.signin);

router.get(
  "/user/:id",
  auth(true),
  authorize(["super-admin", "admin"]),
  partnerUserController.fetchPartnerUser
);

router.get(
  "/:id/users",
  auth(true),
  authorize(["super-admin", "admin"]),
  partnerController.getAllStaff
);
router.patch(
  "/user/:id/update",
  auth(true),
  authorize(["super-admin", "admin"]),
  partnerController.editStaff
);
router.delete(
  "/user/:id",
  auth(true),
  authorize(["super-admin", "admin"]),
  partnerController.deleteStaff
);

router.post(
  "/create",
  auth(true),
  authorize(["super-admin"]),
  partnerController.createPartnerOrganization
);

router.get("/profile", auth(true), partnerAuthController.partnerProfile);

router.patch("/partner/account", auth(true), partnerAuthController.editAccount);

router.get(
  "/",
  auth(true),
  authorize("super-admin"),
  partnerController.getAllPartners
);

router.get(
  "/:id",
  auth(true),
  authorize("super-admin"),
  partnerController.getSinglePartnerOrganization
);

router.patch(
  "/:id/update",
  auth(true),
  authorize("super-admin"),
  partnerController.updatePartnerOrganization
);

router.delete(
  "/:id/delete",
  auth(true),
  authorize("super-admin"),
  partnerController.deletePartnerOrganization
);

module.exports = router;
