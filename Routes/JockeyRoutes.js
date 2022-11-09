const express = require("express");
const router = express.Router();
const {
  CreateJockey,
  GetJockey,
  DeleteJockey,
  EditJockey,
  SingleJockey,
  SoftDeleteJockey,
  GetJockeyforRace,
} = require("../Controller/JockeyController");
const { upload } = require("../Utils/ImageUpload");

router.route("/uploadJockey", upload.single("image")).post(CreateJockey);
router.route("/Jockeyget").get(GetJockey);
router.route("/Jockeygetforrace").get(GetJockeyforRace);
router.route("/deleteJockey/:id").delete(DeleteJockey);
router.route("/softdeleteJockey/:id").delete(SoftDeleteJockey);
router.route("/singlejockey/:id").get(SingleJockey);
router.route("/updateJockey/:id", upload.single("image")).put(EditJockey);

module.exports = router;
