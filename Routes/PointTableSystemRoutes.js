const express = require("express");
const router = express.Router();
const {
  PointTableSystemGet,
  CreatePointTableSystem,
  EditPointTableSystem,
  DeletePointTableSystem,
  SoftDeletePointTableSystem,
  SinglePointTableSystem,
  GetPointTableSystemMaxShortCode,
  GetDeletedPointTableSystem,
  RestoreSoftDeletedPointTableSystem,
} = require("../Controller/PointTableSystemController");
const { upload } = require("../Utils/ImageUpload");
router.route("/PointTableSystemgetdeleted").get(GetDeletedPointTableSystem);
router
  .route("/restoresoftdeletePointTableSystem/:id")
  .post(RestoreSoftDeletedPointTableSystem);
router.route("/getsinglePointTableSystem/:id").get(SinglePointTableSystem);
router
  .route("/getPointTableSystemshortcode")
  .get(GetPointTableSystemMaxShortCode);
router
  .route("/uploadPointTableSystem", upload.single("image"))
  .post(CreatePointTableSystem);
router.route("/PointTableSystemget").get(PointTableSystemGet);
router.route("/deletePointTableSystem/:id").delete(DeletePointTableSystem);
router
  .route("/updatePointTableSystem/:id", upload.single("image"))
  .put(EditPointTableSystem);
router
  .route("/softdeletePointTableSystem/:id")
  .delete(SoftDeletePointTableSystem);
module.exports = router;
