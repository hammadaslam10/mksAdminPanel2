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
  NationalityMassUpload,
  NationalityDropDown,
} = require("../Controller/NationalityController");
const { upload } = require("../Utils/ImageUpload");
router.route("/nationalitygetdeleted").get(GetDeletedNationality);
router.route("/NationalityDropDown").get(NationalityDropDown);
router
  .route("/restoresoftdeletenationality/:id")
  .post(RestoreSoftDeletedNationality);
router.route("/getnationalityshortcode").get(GetNationalityMaxShortCode);
router
  .route("/NationalityMassUpload", upload.single("image"))
  .post(NationalityMassUpload);
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
