const mongoose = require("mongoose");
const {genIDs} = require("../utils/genID");
const Schema = mongoose.Schema;

const contactUsSchema = new Schema(
  {
    // ID of contact us ticket
    ticketID: {
      type: String,
    },

    // Sender Name
    senderName: {
      type: String,
    },

    // Phone number supplied from the currently logged in user
    phoneNumber: {
      type: String,
    },

    // Email is supplied from the current logged in user when sending from the mobile app
    email: {
      type: String,
      required: [true, "Email is required"],
    },

    // Subject of the message
    subject: {
      type: String,
      required: [true, "Subject is required"],
    },

    // Message Content
    message: {
      type: String,
      required: [true, "Message is required"],
    },

    // Status of the ticket:
    status: {
      type: String,
    },
  },
  {timestamps: true},
);

contactUsSchema.pre('save', function (next) {
  this.ticketID = genIDs("SCTC");
  next();
})

const ContactUs = mongoose.model("ContactUs", contactUsSchema);

module.exports = ContactUs;
