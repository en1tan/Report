const express = require("express");
const caseController = require("../../controllers/case");
const authorize = require("../../middleware/authenticate");

const router = express.Router();

router.get("/", authorize("admin"), caseController.getAllCase);
router.get("/:id", authorize("admin"), caseController.getCase);
router.post("/create", authorize("admin"), caseController.createCase);

module.exports = router;
