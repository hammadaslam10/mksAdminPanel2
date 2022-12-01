const express = require("express");
const router = express.Router();
const {
  TrackLengthGet,
  CreateTrackLength,
  EditTrackLength,
  DeleteTrackLength,
  SoftDeleteTrackLength,

} = require("../Controller/TrackLengthController");
const { upload } = require("../Utils/ImageUpload");

router.route("/uploadTrackLength", upload.single("image")).post(CreateTrackLength);
router.route("/TrackLengthget").get(TrackLengthGet);
router.route("/deleteTrackLength/:id").delete(DeleteTrackLength);
router.route("/updateTrackLength/:id", upload.single("image")).put(EditTrackLength);
router.route("/softdeleteTrackLength/:id").delete(SoftDeleteTrackLength);
module.exports = router;
