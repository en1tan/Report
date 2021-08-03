const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth/publicUser");
const passwordReset = require("../../controllers/auth/passwordReset");
const validator = require("../../utils/validator");
const auth = require("../../middleware/authenticate");

router.post(
  "/signup",
  validator("signup", "body"),
  authController.signup,
);
router.post("/activate", authController.activateAccount);
router.get("/verifyEmail/:tokenID", authController.verifyEmail);
router.post("/login", authController.signin);
router.post("/refresh-token", authController.refreshToken);
router.get("/profile", auth(true), authController.profile);
router.patch("/account", auth(true), authController.editAccount);
router.post(
  "/requestPasswordReset",
  passwordReset.requestPasswordReset,
);
router.post("/sendOtp", passwordReset.sendOtp);
router.post("/resendOtp", passwordReset.resendOtp);
router.post("/verifyOtp", passwordReset.verifyOtp);
router.post("/resetPassword", passwordReset.resetPassword);
module.exports = router;
