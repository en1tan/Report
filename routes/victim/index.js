const express = require("express");
const router = express.Router();
const controller = require('../../controllers/victim');

router.post('/case/:id/create', controller.createCaseVictim);
router.get('/:id/all',controller.getCaseVictims)
router.get("/:id",controller.getCaseVictim)
router.patch("/:id/update",controller.updateVictim)
router.delete("/:id/delete",controller.deleteVictim)


module.exports = router;