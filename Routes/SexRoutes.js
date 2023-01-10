const express = require("express");
const router = express.Router();
const {
  SexGet,
  CreateSex,
  EditSex,
  DeleteSex,
  SoftDeleteSex,
  GetSexMaxShortCode,
  RestoreSoftDeletedSex,
  GetDeletedSex,
  SexMassUpload
} = require("../Controller/SexController");
const { upload } = require("../Utils/ImageUpload");
router.route("/sexgetdeleted").get(GetDeletedSex);
router.route("/restoresoftdeletesex/:id").post(RestoreSoftDeletedSex);
router.route("/SexMassUpload").post(SexMassUpload);
router.route("/getsexshortcode").get(GetSexMaxShortCode);
router.route("/uploadSex", upload.single("image")).post(CreateSex);
router.route("/Sexget").get(SexGet);
router.route("/deleteSex/:id").delete(DeleteSex);
router.route("/updateSex/:id", upload.single("image")).put(EditSex);
router.route("/softdeleteSex/:id").delete(SoftDeleteSex);
module.exports = router;
