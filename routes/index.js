const express = require("express");

const user = require("./user");
// const property = require("./property");
// const request = require("./requests");
// const error = require("../controllers/errors");

// const appicationError = require('../utils/applicationError');

const router = express.Router();

router.use("/user", user);
// router.use("/property", property);
// router.use("/request", request);
// router.all("*", error.globalErrors);

// router.use(appicationError);

module.exports = router;
