const dotenv = require("dotenv");
const DB = require("./DB");
const app = require("./app");

dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT || 5000;

DB.connect().then(() => {
  console.log("Database connection successful");
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}...`);
  });
});
