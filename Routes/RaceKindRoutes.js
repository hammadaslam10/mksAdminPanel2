const express = require("express");
const router = express.Router();
const {
  RaceKindGet,
  CreateRaceKind,
  EditRaceKind,
  DeleteRaceKind,
  SoftDeleteRaceKind,
  GetRaceKindMaxShortCode,
  GetDeletedRaceKind,
  RestoreSoftDeletedRaceKind,
  SearchRaceKind,
} = require("../Controller/RaceKindController");
const { upload } = require("../Utils/ImageUpload");
router.route("/racekindgetdeleted").get(GetDeletedRaceKind);
router.route("/searchracekind").get(SearchRaceKind);
router.route("/restoresoftdeleteracekind/:id").post(RestoreSoftDeletedRaceKind);
router.route("/getracekindshortcode").get(GetRaceKindMaxShortCode);
router.route("/uploadRaceKind", upload.single("image")).post(CreateRaceKind);
router.route("/RaceKindget").get(RaceKindGet);
router.route("/deleteRaceKind/:id").delete(DeleteRaceKind);
router.route("/updateRaceKind/:id", upload.single("image")).put(EditRaceKind);
router.route("/softdeleteRaceKind/:id").delete(SoftDeleteRaceKind);
module.exports = router;
