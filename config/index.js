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
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  devPhone: process.env.TWILIO_GENERATED_NUMBER,
};
