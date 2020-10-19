const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const organizationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    }
})

const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;
