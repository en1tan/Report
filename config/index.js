require("dotenv").config({ path: "config.env" });

module.exports = {
  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure:
      process.env.NODE_ENV === "production" ? process.env.MAIL_SECURE : false,
    username: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    sourceEmail: process.env.SOURCE_EMAIL,
  },
  clientURL: process.env.CLIENT_URL,
};
