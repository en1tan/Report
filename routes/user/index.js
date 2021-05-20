const express = require("express");
const authController = require("../../controllers/auth/publicUser");
const partnerAuthController = require("../../controllers/auth/partnerUser");
const validator = require("../../utils/validator");
const caseController = require("../../controllers/case");
// const userController = require('../../controllers/users');

const auth = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorization");

const router = express.Router();

router.post(
  "/signup",
  validator("signup", "body"),
  authController.signup,
);
router.post("/login", authController.signin);

router.post("/partner/signup", partnerAuthController.signup);
router.post("/partner/login", partnerAuthController.signin);

router.get("/profile", auth(), authController.profile);
// router.post('/favourite', authorize, userController.favourite);

module.exports = router;
