const express = require('express');
// const authController = require('../../controllers/auth');
const caseController = require('../../controllers/case');
const uploadImage = require("../../middleware/imageUpload");
// const userController = require('../../controllers/users');

// const authorize = require("../../middleware/authorization");

const router = express.Router();

router.post('/create', caseController.createCase);
router.patch('/:id/evidence', uploadImage, caseController.saveEvidence);
router.patch('/:id/case', caseController.editEvidence);

// router.post('/favourite', authorize, userController.favourite);

module.exports = router;