const errorHandler = {
  normalError(res, statusCode, message, data) {
    return res
      .status(statusCode)
      .json({ message, data, status: "error" });
  },
  tryCatchError(res, error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
      status: "error",
    });
  },
  validationError(res, message) {
    return res.status(400).json({ message, status: "error" });
  },
  authorizationError(res, message) {
    return res.status(401).json({ message, status: "error" });
  },
};

module.exports = errorHandler;
