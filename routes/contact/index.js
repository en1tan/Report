const express = require("express");
const contactController = require("../../controllers/contact");

const router = express.Router();

router.post("/create", contactController.createContact);
router.get("/", contactController.listAllContactRequests);
router.get("/", contactController.getOneContact);

module.exports = router;
