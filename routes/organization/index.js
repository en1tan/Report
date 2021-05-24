const express = require("express");
const organizationController = require("../../controllers/organization");

const auth = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorization");

const router = express.Router();

router.post(
  "/create",
  auth(),
  authorize("super-admin"),
  organizationController.createOrganization,
);

module.exports = router;
