const express = require('express');
const authController = require('../../controllers/auth/publicUser');
const partnerAuthController = require('../../controllers/auth/partnerUser')
// const userController = require('../../controllers/users');

const authorize = require("../../middleware/authorization");

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.signin);

router.post('/partner/signup', partnerAuthController.signup);
router.post('/partner/login', partnerAuthController.signin);

// router.post('/favourite', authorize, userController.favourite);

module.exports = router;