const express = require("express");
const router = express.Router();
const {
  GetSponsorAdmin,
  SponsorGet,
  CreateSponsor,
  EditSponsor,
  DeleteSponsor,
  SoftDeleteSponsor,
  GetDeletedSponsor,
  RestoreSoftDeletedSponsor,
  SponsorMassUpload,
} = require("../Controller/SponsorController");
const { upload } = require("../Utils/ImageUpload");
router.route("/sponsorgetdeleted").get(GetDeletedSponsor);
router.route("/restoresoftdeletesponsor/:id").post(RestoreSoftDeletedSponsor);
router.route("/uploadSponsor", upload.single("image")).post(CreateSponsor);

router.route("/SponsorMassUpload").post(SponsorMassUpload);
router.route("/Sponsorget").get(SponsorGet);
router.route("/deleteSponsor/:id").delete(DeleteSponsor);
router.route("/softdeletesponsor/:id").delete(SoftDeleteSponsor);
router.route("/updateSponsor/:id", upload.single("image")).put(EditSponsor);

module.exports = router;
