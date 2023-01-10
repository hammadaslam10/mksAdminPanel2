const express = require("express");
const router = express.Router();
const {
  HorseKindGet,
  CreateHorseKind,
  EditHorseKind,
  DeleteHorseKind,
  SoftDeleteHorseKind,
  GetDeletedHorseKind,
  RestoreSoftDeletedHorseKind,
  HorseKindMassUpload
} = require("../Controller/HorseKindController");
const { upload } = require("../Utils/ImageUpload");
router.route("/horsekindgetdeleted").get(GetDeletedHorseKind);
router
  .route("/restoresoftdeletehorsekind/:id")
  .post(RestoreSoftDeletedHorseKind);
router.route("/uploadHorseKind", upload.single("image")).post(CreateHorseKind);
router
  .route("/HorseKindMassUpload", upload.single("image"))
  .post(HorseKindMassUpload);
router.route("/HorseKindget").get(HorseKindGet);
router.route("/deleteHorseKind/:id").delete(DeleteHorseKind);
router.route("/updateHorseKind/:id", upload.single("image")).put(EditHorseKind);
router.route("/softdeleteHorseKind/:id").delete(SoftDeleteHorseKind);
module.exports = router;
