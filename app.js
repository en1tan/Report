const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const yamljs = require("yamljs");
const doc = require("./swagger.json");

const swaggerUI = require("swagger-ui-express"),
  swaggerDoc = yamljs.load("./api.yaml");

const app = express();

const queryAuth = require("./utils/queryAuth");
const routes = require("./routes");
const path = require("path");

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
    doc.host = req.get("host");
    req.doc = doc;
    next();
  },
  swaggerUI.serve,
  swaggerUI.setup(doc)
);

module.exports = app;
