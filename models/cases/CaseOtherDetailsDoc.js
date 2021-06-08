const mongoose = require("mongoose");
const {genIDs} = require("../../utils/genID");

const Schema = mongoose.Schema;

const caseOtherDetailsDocSchema = new Schema(
  {
    // Unique Identifier of the extra conversation on a case beteen the reporter and official
    caseOtherDetailsID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CaseOtherDetails",
    },

    // Unique Identifier of the file attached to a reply convo
    docID: {
      type: String,
    },

    // Document Title
    docTitle: {
      type: String,
    },

    // Path or link to which the file is saved
    URL: {
      type: String,
    },

    // Date and Time the file was uploaded
    timestamp: {
      type: Date,
      default: Date.now(),
    },
  },
  {timestamps: true},
);

caseOtherDetailsDocSchema.pre('save', function (next) {
  this.docID = genIDs("SODD");
  next();
})

const CaseOtherDetailsDoc = mongoose.model(
  "CaseOtherDetailsDoc",
  caseOtherDetailsDocSchema,
);

module.exports = CaseOtherDetailsDoc;
