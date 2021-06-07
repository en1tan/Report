const express = require("express");
const caseRoute = require("./case");
const categoryRoute = require("./category");
const auth = require("../../middleware/authenticate");

const router = express.Router();

router.use("/", auth(true), caseRoute);
router.use("/category", auth(true), categoryRoute);

module.exports = router;
