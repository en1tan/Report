const express = require('express');
const organizationController = require('../../controllers/organization');

const authorize = require("../../middleware/authorization");

const router = express.Router();

router.post('/create', authorize("public"), organizationController.createOrganization);

module.exports = router;