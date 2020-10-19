const express = require('express');
const organizationController = require('../../controllers/organization');

const router = express.Router();

router.post('/create', organizationController.createOrganization);

module.exports = router;