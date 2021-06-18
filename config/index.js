require("dotenv").config({ path: "config.env" });

module.exports = {
  mail: {
    host: process.env.MAIL_HOST,
    pass: process.env.MAIL_PASS,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE,
  },
};
