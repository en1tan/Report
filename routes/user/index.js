const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth/publicUser");
const partnerAuthController = require("../../controllers/auth/partnerUser");
const validator = require("../../utils/validator");
const auth = require("../../middleware/authenticate");
const partnerRoutes = require("./partner");

router.post(
  "/signup",
  validator("signup", "body"),
  authController.signup,
);
router.post("/login", authController.signin);

router.post("/partner/signup", partnerAuthController.signup);
router.post("/partner/login", partnerAuthController.signin);

router.get("/profile", auth(), authController.profile);

router.use("/partner", auth(), partnerRoutes);

module.exports = router;
