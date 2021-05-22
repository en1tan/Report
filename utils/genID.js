const genID = Math.random().toString(8).substr(2, 5);
module.exports = {
  genCaseID: "SCSE" + genID,
  genCategoryID: "SCAT" + genID,
  genCategoryGroupID: "SGRP" + genID,
  genEvidenceID: "SEVF" + genID,
  genOtherDetails: "SODD" + genID,
  genProgressDocID: "SPGD" + genID,
  genSuspectID: "SCES" + genID,
  genVictimID: "SCEV" + genID,
  genWitnessID: "SCEW" + genID,
  genPartnerID: "SPTR" + genID,
  genPartnerBranchID: "SPRB" + genID,
  genPartnerUserID: "SPRU" + genID,
  genContactUsID: "SCTC" + genID,
};
