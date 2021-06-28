const nodemailer = require("nodemailer");
const config = require("../config");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const {
  normalError,
  tryCatchError,
} = require("../utils/errorHandlers");
const { successNoData } = require("../utils/successHandler");

exports.sendMail = async (
  res,
  email,
  subject,
  payload,
  template = "",
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: config.mail.host,
      port: config.mail.port,
      auth: {
        user: config.mail.username,
        pass: config.mail.pass,
      },
    });

    const source = fs.readFileSync(
      path.join(__dirname, template),
      "utf-8",
    );
    const compiledTemplate = handlebars.compile(source);
    const options = () => {
      return {
        from: config.mail.sourceEmail,
        to: email,
        subject: subject,
        html: compiledTemplate(payload),
      };
    };

    // Send email
    transporter.sendMail(options(), (error, info) => {
      if (error) {
        console.log(error);
        // return normalError(
        //   res,
        //   400,
        //   "An error occurred. Please try again",
        // );
      } else {
        console.log(info.response);
        return successNoData(res, 200, "mail sent successfully");
      }
    });
  } catch (err) {
    return tryCatchError(res, err);
  }
};
