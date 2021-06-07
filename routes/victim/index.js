const express = require("express");
const router = express.Router();
const controller = require('../../controllers/victim');

router.post('/case/:id/create', controller.createCaseVictim);
router.get('/',controller.getCaseVictims)
router.get("/:id",controller.getCaseVictim)
router.patch("/:id",controller.updateVictim)
router.delete("/:id",controller.deleteVictim)


module.exports = router;