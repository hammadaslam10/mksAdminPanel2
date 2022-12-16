const express = require("express");
const router = express.Router();
const {
  RaceTypeGet,
  CreateRaceType,
  EditRaceType,
  DeleteRaceType,
  SoftDeleteRaceType,
  GetRaceTypeMaxShortCode,
  GetDeletedRaceType,
  RestoreSoftDeletedRaceType
} = require("../Controller/RaceTypeController");
const { upload } = require("../Utils/ImageUpload");
router.route("/racetypegetdeleted").get(GetDeletedRaceType);
router.route("/restoresoftdeleteracetype/:id").post(RestoreSoftDeletedRaceType);
router.route("/getracetypeshortcode").get(GetRaceTypeMaxShortCode);
router.route("/uploadRaceType", upload.single("image")).post(CreateRaceType);
router.route("/RaceTypeget").get(RaceTypeGet);
router.route("/deleteRaceType/:id").delete(DeleteRaceType);
router.route("/updateRaceType/:id", upload.single("image")).put(EditRaceType);
router.route("/softdeleteRaceType/:id").delete(SoftDeleteRaceType);
module.exports = router;
