const {
  normalError,
  authorizationError,
} = require("../utils/errorHandlers");

module.exports =
  (roles = []) =>
  async (req, res, next) => {
    if (typeof roles === "string") roles = [roles];
    try {
      if (roles.length > 0 && !roles.includes(req.user.role))
        return authorizationError(
          res,
          "You do not have enough privilege for this action",
        );
      next();
    } catch (err) {
      return normalError(res, 400, "An error occured", null);
    }
  };
