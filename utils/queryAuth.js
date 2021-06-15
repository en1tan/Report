const { clientError } = require("./errorHandlers");

module.exports = queryAuth;

function queryAuth() {
  return async (req, res, next) => {
    if (req.headers.clientKey !== process.env.CLIENT_KEY) {
      if (req.headers.authorization) {
        req.authorized = true;
        next();
      } else {
        req.authorized = false;
        next();
      }
    } else {
      return clientError(
        res,
        "Your client version is incompatible." +
          " Please download the current mobile app version or " +
          " visit https://sorosoke.com to use the web client"
      );
    }
  };
}
