const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const useragent = require("express-useragent");
const redoc = require("redoc-express");

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

app.get("/swagger.json", (req, res) => {
  res.sendFile("/swagger.json", { root: "." });
});

app.get(
  "/docs",
  redoc({
    title: "Sorosoke API",
    specUrl: "/swagger.json",
  })
);
module.exports = app;
