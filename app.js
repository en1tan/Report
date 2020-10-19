const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

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

app.get("/", (req, res) => res.send("Hello"));

app.use("/api/v1/", routes);

module.exports = app;
