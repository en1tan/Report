const express = require("express");
const router = express.Router();
const authorize = require("../../middleware/authorization");
const validate = require("../../utils/validator");

const controller = require("../../controllers/suspect");

router.post(
  "/:caseID/create",
  validate("suspect", "body"),
  controller.createSuspect
);
router.get("/:caseID/all", controller.getSuspects);
router.get("/:id", controller.getSuspect);
router.patch("/:id/update", authorize(["staff"]), controller.editSuspect);
router.delete(":id/delete", controller.deleteSuspect);

module.exports = router;
