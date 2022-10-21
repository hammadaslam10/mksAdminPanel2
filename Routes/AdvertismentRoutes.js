const express = require("express");
const router = express.Router();
const {
  AdsGet,
  CreateAdvertisment,
  EditAds,
  DeleteAds,
  SoftDeleteAds,
} = require("../Controller/AdvertismentController");
const { upload } = require("../Utils/ImageUpload");

router.route("/uploadAds", upload.single("image")).post(CreateAdvertisment);
router.route("/Adsget/:id").get(AdsGet);
router.route("/deleteAds/:id").delete(DeleteAds);
router.route("/updateAds/:id", upload.single("image")).put(EditAds);
router.route("/softdeleteAds/:id").delete(SoftDeleteAds);
module.exports = router;
