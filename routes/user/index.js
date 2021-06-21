const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth/publicUser");
const passwordReset = require("../../controllers/auth/passwordReset");
const validator = require("../../utils/validator");
const auth = require("../../middleware/authenticate");

router.post("/signup", validator("signup", "body"), authController.signup);
router.post("/login", authController.signin);
router.get("/profile", auth(), authController.profile);
router.patch("/account", auth(), authController.editAccount);
router.post("/requestPasswordReset", passwordReset.requestPasswordRequest);
router.post("/sendOtp", passwordReset.sendOtp);
router.post("/verifyOtp", passwordReset.verifyOtp);
router.post("/resetPassword", passwordReset.resetPassword);
module.exports = router;
