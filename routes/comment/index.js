const express = require('express');
const authorize = require("../../middleware/authorization");
const commentController = require('../../controllers/comment');

const router = express.Router();

router.post('/create/:caseId', authorize, commentController.createComment);

module.exports = router;