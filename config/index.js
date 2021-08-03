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
  serverURL:
    process.env.NODE_ENV === "production"
      ? process.env.SERVER_URL
      : "http://localhost:5000/api/v1",
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  devPhone: process.env.TWILIO_GENERATED_NUMBER,
  dbURL:
    process.env.NODE_ENV === "production"
      ? process.env.DATABASE
      : process.env.DATABASE_LOCAL,
};
