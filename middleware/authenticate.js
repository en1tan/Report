const jwt = require("jsonwebtoken");
const PartnerUser = require("../models/partners/PartnerUser");
const PublicUser = require("../models/PublicUser");
const { authorizationError } = require("../utils/errorHandlers");

module.exports = authenticate;

function authenticate(status = false) {
  return async (req, res, next) => {
    let token;
    try {
      if (req.authorized) {
        if (
          req.headers.authorization &&
          req.headers.authorization.startsWith("Bearer")
        )
          token = req.headers.authorization.split(" ")[1];
        if (!token) return authorizationError(res, "You need a token");
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.exp < Date.now().valueOf() / 1000)
          return authorizationError(res, "Invalid token");
        if (!decoded.userType) {
          req.user = await PublicUser.findById(decoded.id);
        } else {
          req.user = await PartnerUser.findById(decoded.id);
        }
      } else if (!req.authorized && status === true)
        return authorizationError(
          res,
          "Unauthorized. You need to be logged in"
        );
      next();
    } catch (err) {
      return authorizationError(res, "Unauthorized");
    }
  };
}
