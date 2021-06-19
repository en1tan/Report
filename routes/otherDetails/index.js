const express = require("express");
const otherDetailsController = require("../../controllers/otherDetails");
const auth = require("../../middleware/authenticate");

const router = express.Router();

router.post(
  "/create/:caseID",
  auth(true),
  otherDetailsController.createOtherDetails
);

router.get(
  "/:caseID/conversations",
  auth(true),
  otherDetailsController.fetchAllConversations
);

router.get(
  "/:id/conversation",
  auth(true),
  otherDetailsController.fetchConversation
);

router.delete("/:id/delete", otherDetailsController.deleteConversation);

module.exports = router;
