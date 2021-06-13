const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth/publicUser");
const validator = require("../../utils/validator");
const auth = require("../../middleware/authenticate");

router.post("/signup", validator("signup", "body"), authController.signup);
router.post("/login", authController.signin);
router.get("/profile", auth(), authController.profile);
router.patch("/account", auth(), authController.editAccount);
module.exports = router;
