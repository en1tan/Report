const express = require('express');
const router = express.Router();
const controller = require('../../controllers/device');

router.post('/register', controller.registerDevice);
router.post('/refresh', controller.refreshDevice);

module.exports = router;
