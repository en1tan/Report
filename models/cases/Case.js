const mongoose = require('mongoose');
const { genIDs } = require('../../utils/genID');

const Schema = mongoose.Schema;

const caseSchema = new Schema(
  {
    // Unique identifier of the case on the Sorosoke platform
    caseID: {
      type: String,
      immutable: true,
    },

    // Unique ID of the User reporting the case
    publicUserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PublicUser',
      required: true,
      immutable: true,
    },

    caseAvatar: {
      type: String,
      immutable: true,
    },

    // Category ID of the case
    categoryGroupID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CaseCategoryGroup',
      required: true,
    },

    // ID NBA official that has been assigned the case for follow up and updates
    // Default "NotYetAssigned"
    assignedPartnerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PartnerUser',
    },

    // Title of the Case given when publishing the case
    // Default "NotYetAssigned"
    caseTitle: {
      type: String,
      default: 'NotYetAssigned',
    },

    // Where exactly the incident took place
    addressOfIncident: String,

    // Areas Close to the address to help locate it faster
    addressLandmark: String,

    // Date the incident occurred
    dateOfIncident: {
      type: Date,
      required: true,
      default: Date.now(),
    },

    // When the incident took place
    hourOfIncident: String,

    // Country the Incident took place
    country: String,

    // State the Incident took place
    state: String,

    // LGA the Incident took place
    lga: String,

    // Describing the Incident
    descriptionOfIncident: String,

    // If the user reporting is the victim
    areYouTheVictim: {
      type: String,
      enum: ['Yes', 'No'],
      default: 'No',
      required: true,
    },

    // Type of Report
    reportType: {
      type: String,
      enum: ['Standard', 'QuickReport'],
      required: true,
      immutable: true,
    },

    // What are the things the case reporter want to be done by the platform
    casePleas: String,

    // Status of the case- "Incidence" when not confirmed- "case" when incident has be confirmed and filed
    caseTypeStatus: {
      type: String,
      enum: ['Incidence', 'Case', 'QuickReport'],
      default: 'Incidence',
      required: true,
    },

    // Summary of all what the case is about by the official handling the case and this will be displayed
    // when the public is viewing the case. This will be entered when publishing the case
    caseSummary: String,

    // Status if case is visible to the public or not
    publishStatus: {
      type: String,
      enum: ['published', 'unPublished'],
      default: 'unPublished',
    },

    // ID of the official that published the case; you can only publish a record whose case status is "case"
    publishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PartnerUser',
    },
    datePublished: {
      type: String,
    },

    // If the case has been resolved and closed or unresolved and open. by default for Quick report the value will be "onlyReport"
    resolutionStatus: {
      type: String,
      enum: ['resolved', 'unResolved', 'onlyReport'],
      default: 'unResolved',
    },

    // If the case has been verified, by default for Quick report the value will be "onlyReport"
    verificationStatus: {
      type: String,
      enum: ['verified', 'unVerified', 'onlyReport'],
      default: 'unVerified',
    },

    followedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'FollowCase',
      },
    ],

    // Which of the sorosoke platforms was used in reporting the case
    platformOfReport: {
      type: String,
      enum: ['mobile', 'web', 'sms'],
      default: 'web',
      immutable: true,
    },
  },
  { timestamps: true }
);

caseSchema.pre('save', function (next) {
  this.caseID = genIDs('SCSE');
  next();
});

const Case = mongoose.model('Case', caseSchema);

module.exports = Case;
