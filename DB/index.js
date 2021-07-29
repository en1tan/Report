const mongoose = require("mongoose");
const { dbURL } = require("../config");

const connect = () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(dbURL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        autoIndex: true,
      })
      .then((res, err) => {
        if (err) return reject(err);
        resolve();
      });
  });
};

const close = () => {
  // return mongoose.connection.close()
  return mongoose.disconnect();
};

module.exports = { connect, close };
