module.exports = queryAuth;
function queryAuth() {
  return async (req, res, next) => {
    if (req.headers.authorization) {
      req.authorized = true;
      next();
    } else {
      req.authorized = false;
      next();
    }
  };
}
