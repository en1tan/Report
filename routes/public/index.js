const express = require("express");
const router = express.Router();
const caseController = require("../../controllers/case");

router.get("/cases", caseController.getPublicCases);

module.exports = router;
