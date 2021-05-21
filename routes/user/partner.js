const express = require("express");
const router = express.Router();

const authorize = require("../../middleware/authorization");
const partnerController = require("../../controllers/users/partner");

router.get(
  "/",
  authorize(["super-admin", "admin"]),
  partnerController.getAllStaff,
);
router.patch(
  "/:id/update",
  authorize("admin"),
  partnerController.editStaff,
);
router.delete(
  "/:id",
  authorize("admin"),
  partnerController.deleteStaff,
);

module.exports = router;
