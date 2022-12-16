const express = require("express");
const router = express.Router();
const {
  NationalityGet,
  CreateNationality,
  EditNationality,
  DeleteNationality,
  SoftDeleteNationality,
  GetNationalityMaxShortCode,
  GetDeletedNationality,
  RestoreSoftDeletedNationality,
} = require("../Controller/NationalityController");
const { upload } = require("../Utils/ImageUpload");
router.route("/nationalitygetdeleted").get(GetDeletedNationality);
router
  .route("/restoresoftdeletenationality/:id")
  .post(RestoreSoftDeletedNationality);
router.route("/getnationalityshortcode").get(GetNationalityMaxShortCode);
router
  .route("/uploadNationality", upload.single("image"))
  .post(CreateNationality);
router.route("/Nationalityget").get(NationalityGet);
router.route("/deleteNationality/:id").delete(DeleteNationality);
router
  .route("/updateNationality/:id", upload.single("image"))
  .put(EditNationality);
router.route("/softdeleteNationality/:id").delete(SoftDeleteNationality);
module.exports = router;
