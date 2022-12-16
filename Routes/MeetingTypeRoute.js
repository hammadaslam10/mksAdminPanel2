const express = require("express");
const router = express.Router();
const {
  MeetingTypeGet,
  CreateMeetingType,
  EditMeetingType,
  DeleteMeetingType,
  SoftDeleteMeetingType,
  GetMeetingTypeMaxShortCode,
  GetDeletedMeetingType,
  RestoreSoftDeletedMeetingType,
} = require("../Controller/MeetingTypeController");
const { upload } = require("../Utils/ImageUpload");
router.route("/meetingtypegetdeleted").get(GetDeletedMeetingType);
router.route("/restoresoftdeletemeetingtype/:id").post(RestoreSoftDeletedMeetingType);
router.route("/getmeetingtypeshortcode").get(GetMeetingTypeMaxShortCode);
router
  .route("/uploadMeetingType", upload.single("image"))
  .post(CreateMeetingType);
router.route("/MeetingTypeget").get(MeetingTypeGet);
router.route("/deleteMeetingType/:id").delete(DeleteMeetingType);
router
  .route("/updateMeetingType/:id", upload.single("image"))
  .put(EditMeetingType);
router.route("/softdeleteMeetingType/:id").delete(SoftDeleteMeetingType);
module.exports = router;
