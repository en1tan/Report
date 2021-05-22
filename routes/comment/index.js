const express = require("express");
const auth = require("../../middleware/authenticate");
const commentController = require("../../controllers/comment");

const router = express.Router();

router.post(
  "/create/:caseId",
  auth(),
  commentController.createComment
);

module.exports = router;

