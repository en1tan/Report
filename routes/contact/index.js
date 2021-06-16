const express = require("express");
const contactController = require("../../controllers/contact");

const auth = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorization");

const router = express.Router();

router.post("/create", contactController.createContact);
router.get(
  "/",
  auth(true),
  authorize("super-admin|"),
  contactController.listAllContactRequests
);
router.get(
  "/:id",
  auth(true),
  authorize("super-admin|"),
  contactController.getOneContact
);

module.exports = router;
