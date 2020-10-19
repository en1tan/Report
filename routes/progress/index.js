const express = require('express');
const progressController = require('../../controllers/progress');

const router = express.Router();

router.post('/create/:caseId', progressController.createProgress);
router.patch('/:id/edit/:caseId', progressController.addProgress);


module.exports = router;