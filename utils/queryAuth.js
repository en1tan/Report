const { clientError } = require("./errorHandlers");

module.exports = queryAuth;

function queryAuth() {
  return async (req, res, next) => {
    const mobile = req.useragent.isMobile;
    if (mobile && req.headers.clientKey !== process.env.CLIENT_KEY)
      return clientError(
        res,
        "Your client version is incompatible." +
          " Please download the current mobile app version or " +
          " visit https://sorosoke.com to use the web client"
      );
    if (req.headers.authorization) {
      req.authorized = true;
      next();
    } else {
      req.authorized = false;
      next();
    }
  };
}
