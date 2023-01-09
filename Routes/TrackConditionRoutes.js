const express = require("express");
const router = express.Router();
const {
  TrackConditionGet,
  CreateTrackCondition,
  EditTrackCondition,
  DeleteTrackCondition,
  SoftDeleteTrackCondition,
  GetTrackConditionMaxShortCode,
  GetDeletedTrackCondition,
  RestoreSoftDeletedTrackCondition,
} = require("../Controller/TrackConditionController");
const { upload } = require("../Utils/ImageUpload");
router.route("/TrackConditiongetdeleted").get(GetDeletedTrackCondition);
router
  .route("/restoresoftdeleteTrackCondition/:id")
  .post(RestoreSoftDeletedTrackCondition);
router.route("/getTrackConditionshortcode").get(GetTrackConditionMaxShortCode);
router
  .route("/uploadTrackCondition", upload.single("image"))
  .post(CreateTrackCondition);
router.route("/TrackConditionget").get(TrackConditionGet);
router.route("/deleteTrackCondition/:id").delete(DeleteTrackCondition);
router
  .route("/updateTrackCondition/:id", upload.single("image"))
  .put(EditTrackCondition);
router.route("/softdeleteTrackCondition/:id").delete(SoftDeleteTrackCondition);
module.exports = router;
