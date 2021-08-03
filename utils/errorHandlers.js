const errorHandler = {
  /**
   * Send normal Error
   * @param {Express.Response} res
   * @param {number} statusCode
   * @param {string} message
   * @param {*} data
   * @returns {*}
   */
  normalError(res, statusCode, message, data = null) {
    return res.status(statusCode).json({ message, data, status: "error" });
  },

  /**
   * Send try catch Error
   * @param {Express.Response} res
   * @param {Error} error
   * @returns {*}
   */
  tryCatchError(res, error) {
    console.error(error);
    return res.status(500).json({
      message: error.message || error,
      status: "error",
    });
  },

  /**
   * Send validation Error
   * @param {Express.Response} res
   * @param {string} message
   * @returns {*}
   */
  validationError(res, message) {
    return res.status(400).json({ message, status: "error" });
  },

  /**
   * Send authorization Error
   * @param {Express.Response} res
   * @param {string} message
   * @returns {*}
   */
  authorizationError(res, message) {
    return res.status(401).json({ message, status: "error" });
  },
  /**
   * Send authorization Error
   * @param {Express.Response} res
   * @param {string} message
   * @returns {*}
   */
  clientError(res, message) {
    return res.status(406).json({ message, status: "version error" });
  },
};

module.exports = errorHandler;
