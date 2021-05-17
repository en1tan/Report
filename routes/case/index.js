const express = require("express");
const caseRoute = require("./case");
const categoryRoute = require("./category");
const auth = require("../../middleware/authenticate");

const router = express.Router();

router.use("/", auth(), caseRoute);
router.use("/category", auth(), categoryRoute);

module.exports = router;
