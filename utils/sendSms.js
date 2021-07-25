const { accountSid, authToken, devPhone } = require("../config");
const client = require("twilio")(accountSid, authToken);
const phoneNumberParser = require("libphonenumber-js");

exports.sendSms = async (to, message) => {
  await client.messages.create({
    from: devPhone,
    to: phoneNumberParser(to, "NG").format("E.164"),
    body: message,
  });
};
