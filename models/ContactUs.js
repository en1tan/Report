const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const contactUsSchema = new Schema({
    fullName: {
        type: String,
        required: [true, "Full name is required"]
    },
    phoneNumber: {
        type: String
    },
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    subject: {
        type: String,
        required: [true, "Subject is required"]
    },
    message: {
        type: String,
        required: [true, "Message is required"]
    }
});

const ContactUs = mongoose.model("ContactUs", contactUsSchema);

module.exports = ContactUs;
