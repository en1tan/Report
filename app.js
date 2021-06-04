const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const yamljs = require("yamljs");

const swaggerUI = require("swagger-ui-express"),
  swaggerDoc = yamljs.load("./api.yaml");

const app = express();

const queryAuth = require("./utils/queryAuth");
const routes = require("./routes");

//cors
app.use(cors({ origin: true }));

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser reading data from req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/", queryAuth(), routes);

app.use(
  "/docs",
  (req, res, next) => {
    swaggerDoc.host = req.get("host");
    req.swaggerDoc = swaggerDoc;
    next();
  },
  swaggerUI.serve,
  swaggerUI.setup(swaggerDoc)
);

module.exports = app;
