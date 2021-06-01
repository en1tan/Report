const express = require("express");
const router = express.Router();
const caseController = require("../../controllers/case");

router.get("/cases", caseController.getPublicCases);
router.get("/cases", caseController.getSinglePublicCase);

module.exports = router;
