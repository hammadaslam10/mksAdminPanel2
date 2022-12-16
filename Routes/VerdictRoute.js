const express = require("express");
const router = express.Router();
const {
  VerdictGet,
  CreateVerdict,
  EditVerdict,
  DeleteVerdict,
  SoftDeleteVerdict,
  GetVerdictMaxShortCode,
  GetDeletedVerdict,
  RestoreSoftDeletedVerdict,
} = require("../Controller/VerdictController");
const { upload } = require("../Utils/ImageUpload");
router.route("/verdictgetdeleted").get(GetDeletedVerdict);
router.route("/restoresoftdeleteverdict/:id").post(RestoreSoftDeletedVerdict);
router.route("/getverdictshortcode").get(GetVerdictMaxShortCode);
router.route("/uploadVerdict", upload.single("image")).post(CreateVerdict);
router.route("/Verdictget").get(VerdictGet);
router.route("/deleteVerdict/:id").delete(DeleteVerdict);
router.route("/updateVerdict/:id", upload.single("image")).put(EditVerdict);
router.route("/softdeleteVerdict/:id").delete(SoftDeleteVerdict);
module.exports = router;
