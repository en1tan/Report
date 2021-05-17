const jwt = require("jsonwebtoken");
const PartnerUser = require("../models/partners/PartnerUser");
const PublicUser = require("../models/PublicUser");
const { authorizationError } = require("../utils/errorHandlers");

module.exports = authenticate;
function authenticate() {
  return async (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    )
      token = req.headers.authorization.split(" ")[1];
    if (!token) return authorizationError(res, "you need a token");
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.exp < Date.now().valueOf() / 1000)
      return authorizationError(res, "invalid token");
    if (decoded.userType === "public") {
      const user = await PublicUser.findById(decoded.id);
      req.user = user;
    } else {
      const user = await PartnerUser.findById(decoded.id);
      req.user = user;
    }
    next();
  };
}
