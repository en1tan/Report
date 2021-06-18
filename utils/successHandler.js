const capitalize = require("../utils/capitalize");

const successHandler = {
  /**
   * send success with no data
   * @param {Express.Response} res
   * @param {number} statusCode
   * @param {string} message
   * @returns {*}
   */
  successNoData(res, statusCode, message) {
    return res
      .status(statusCode)
      .json({ message: capitalize(message), status: "success" });
  },
  /**
   * send success with no message
   * @param {Express.Response} res
   * @param {number} statusCode
   * @param {*} data
   * @returns {*}
   */
  successNoMessage(res, statusCode, data) {
    return res.status(statusCode).json({ data, status: "success" });
  },
  /**
   * Send success with data
   * @param {Express.Response} res
   * @param {number} statusCode
   * @param {string} message
   * @param {*} data
   * @returns {*}
   */
  successWithData(res, statusCode, message, data) {
    return res.status(statusCode).json({
      message: capitalize(message),
      status: "success",
      data,
    });
  },
};

module.exports = successHandler;
