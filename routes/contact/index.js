const express = require("express");
const contactController = require("../../controllers/contact");

const router = express.Router();

router.post("/create", contactController.createContact);

module.exports = router;
