const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const progressSchema = new Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
  },
  reports: [
    {
      text: String,
      date: {
        type: Date,
        default: Date.now(),
      },
    },
  ]
});

const Progress = mongoose.model("Progress", progressSchema);

module.exports = Progress;
