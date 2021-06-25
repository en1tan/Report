const express = require("express");
const router = express.Router();
const controller = require("../../controllers/witness");
const validate = require("../../utils/validator");

router.post("/:caseID/create", validate("witness","body"), controller.createWitness);
router.get("/:caseID/all", controller.getWitnesses);
router.get("/:id", controller.getWitness);
router.patch("/:id/update", controller.updateWitness);
router.delete("/:id/delete", controller.deleteWitness);

module.exports = router;
