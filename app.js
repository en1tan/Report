const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const ymljs = require("yamljs");
const doc = ymljs.load("./swagger.yaml");
const swaggerUI = require("swagger-ui-express");
const useragent = require("express-useragent");

const app = express();

const queryAuth = require("./utils/queryAuth");
const routes = require("./routes");

//cors
app.use(cors());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser reading data from req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(useragent.express());

app.use("/api/v1/", queryAuth(), routes);

app.use("/docs", swaggerUI.serve, swaggerUI.setup(doc));

module.exports = app;
