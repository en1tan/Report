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
        type: String
    },
    message: {
        type: String
    }
});

const ContactUs = mongoose.model("ContactUs", contactUsSchema);

module.exports = ContactUs;
