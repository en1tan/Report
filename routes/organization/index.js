const express = require("express");
const organizationController = require("../../controllers/organization");

const authorize = require("../../middleware/authorization");

const router = express.Router();

router.post(
  "/create",
  authorize("super-admin"),
  organizationController.createOrganization
);

router.get("/", organizationController.getAllOrganizations);
router.get(
  "/:id",
  authorize("super-admin"),
  organizationController.getOneOrganization
);
router.patch(
  "/:id/update",
  authorize("super-admin"),
  organizationController.updateOrganization
);
router.delete(
  "/:id/delete",
  authorize("super-admin"),
  organizationController.deleteOrganization
);
module.exports = router;
