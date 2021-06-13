const express = require("express");
const auth = require("../../middleware/authenticate");
const commentController = require("../../controllers/comment");

const router = express.Router();

router.post("/create/:caseId", auth(true), commentController.createComment);
router.get("/:caseID", commentController.readComments);
router.patch("/:id", commentController.updateComment);
router.delete("/:id/delete", commentController.deleteComment);
module.exports = router;
