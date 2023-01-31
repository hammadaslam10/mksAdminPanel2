const express = require("express");
const router = express.Router();
const {
  FinalPositionGet,
  CreateFinalPosition,
  EditFinalPosition,
  DeleteFinalPosition,
  SoftDeleteFinalPosition,
  SingleFinalPosition,
  GetFinalPositionMaxShortCode,
  GetDeletedFinalPosition,
  RestoreSoftDeletedFinalPosition,
  FinalPositionMassUpload,
} = require("../Controller/FinalPositionController");
const { upload } = require("../Utils/ImageUpload");
router.route("/FinalPositiongetdeleted").get(GetDeletedFinalPosition);
router
  .route("/restoresoftdeleteFinalPosition/:id")
  .post(RestoreSoftDeletedFinalPosition);
router.route("/FinalPositionMassUpload").post(FinalPositionMassUpload);
router.route("/getsingleFinalPosition/:id").get(SingleFinalPosition);
router.route("/getFinalPositionshortcode").get(GetFinalPositionMaxShortCode);
router
  .route("/uploadFinalPosition", upload.single("image"))
  .post(CreateFinalPosition);
router.route("/FinalPositionget").get(FinalPositionGet);
router.route("/deleteFinalPosition/:id").delete(DeleteFinalPosition);
router
  .route("/updateFinalPosition/:id", upload.single("image"))
  .put(EditFinalPosition);
router.route("/softdeleteFinalPosition/:id").delete(SoftDeleteFinalPosition);
module.exports = router;
