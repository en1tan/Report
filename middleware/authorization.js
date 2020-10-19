const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { validationError, normalError } = require("../utils/errorHandlers");

const authorization = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      normalError(
        res,
        401,
        "You are not logged in! Please log in to get access.",
        {}
      )
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      normalError(
        res,
        401,
        "This user does not exist.",
        {}
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  //   if (currentUser.changedPasswordAfter(decoded.iat)) {
  //     return next(
  //       new AppError('User recently changed password! Please log in again.', 401)
  //     );
  //   }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
};

module.exports = authorization;
