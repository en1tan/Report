const mongoose = require("mongoose");
const { genIDs } = require("../../utils/genID");

const Schema = mongoose.Schema;

const caseProgressDocSchema = new Schema(
  {
    // ID of the File
    docID: {
      type: String,
    },

    // ID of the Case Progress
    caseProgressID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CaseProgress",
    },

    // Name of File
    docTitle: {
      type: String,
      required: true,
    },

    // Link to the file
    URL: {
      type: String,
    },
  },
  { timestamps: true },
);

caseProgressDocSchema.pre('save',function(next){
  this.docID = genIDs("SPGD");
  next();
})

const CaseProgressDoc = mongoose.model(
  "CaseProgressDoc",
  caseProgressDocSchema,
);

module.exports = CaseProgressDoc;
