const express = require("express");
const contactController = require("../../controllers/contact");
const auth = require("../../middleware/authenticate");

const router = express.Router();

router.post("/create", auth(), contactController.createContact);

module.exports = router;
