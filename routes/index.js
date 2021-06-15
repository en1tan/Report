const express = require("express");

const auth = require("../middleware/authenticate");

const user = require("./user");
const cases = require("./case");
const organization = require("./organization");
const progress = require("./progress");
const contact = require("./contact");
const comment = require("./comment");
const details = require("./otherDetails");
const error = require("../controllers/errors");
const partner = require("./partner");
const public = require("./public");
const victim = require("./victim");
const suspect = require("./suspect");
const witness = require("./witness");
const branch = require("./branch");

const applicationError = require("../utils/applicationError");

const router = express.Router();

router.use("/public", public);
router.use("/user", user);
router.use("/partner", partner);
router.use("/case", auth(true), cases);
router.use("/organization", organization);
router.use("/progress", progress);
router.use("/details", details);
router.use("/contact", contact);
router.use("/comment", comment);
router.use("/victim", auth(true), victim);
router.use("/suspect", auth(true), suspect);
router.use("/witness", auth(true), witness);
router.use("/branch", auth(true), branch);
router.all("*", error.globalErrors);

router.use(applicationError);

module.exports = router;
