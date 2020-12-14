const express = require('express');
// const authController = require('../../controllers/auth');
const caseController = require('../../controllers/case');
const uploadImage = require("../../middleware/imageUpload");
// const userController = require('../../controllers/users');

const authorize = require("../../middleware/authorization");

const router = express.Router();

router.post('/create/:caseID/caseVictim', authorize("public"), caseController.createCaseVictim);
router.post('/create/:caseID/caseSuspect', authorize("public"), caseController.createCaseSuspect);
router.post('/create/:caseID/caseWitness', authorize("public"), caseController.createCaseWitness);
router.post('/create/:caseID/otherDetails', authorize("public"), caseController.createCaseOtherDetails);
router.post('/create/:caseID/caseProgress', authorize("public"), caseController.createCaseProgress);

router.get('/', caseController.getAllCase);
router.get('/:id', authorize("public"), caseController.getCase);
router.post('/create', authorize("public"), caseController.createCase);

router.post('/categoryGroup/create', authorize("public"), caseController.createCaseCategoryGroup);
router.post('/category/create/:groupID', authorize("public"), caseController.createCaseCategory);
router.patch('/:id/evidence', uploadImage, caseController.saveEvidence);
router.patch('/:id/case', caseController.editEvidence);

// router.post('/favourite', authorize, userController.favourite);

module.exports = router;