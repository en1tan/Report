const nodemailer = require("nodemailer");
const config = require("../config");

exports.sendTempPassword = async () => {
  console.log(config.mail.host);
};
