const express = require("express");
const router = express.Router();
const {
  SeoKeywordGet,
  CreateSeoKeyword,
  EditSeoKeyword,
  DeleteSeoKeyword,
  SoftDeleteSeoKeyword,
  GetDeletedSeokeyword,
  RestoreSoftDeletedSeokeyword
} = require("../Controller/SeoKeywordController");
const { upload } = require("../Utils/ImageUpload");
router.route("/seokeywordgetdeleted").get(GetDeletedSeokeyword);
router.route("/restoresoftdeleteseokeyword/:id").post(RestoreSoftDeletedSeokeyword);
router.route("/uploadSeoKeyword", upload.single("image")).post(CreateSeoKeyword);
router.route("/SeoKeywordget").get(SeoKeywordGet);
router.route("/deleteSeoKeyword/:id").delete(DeleteSeoKeyword);
router.route("/updateSeoKeyword/:id", upload.single("image")).put(EditSeoKeyword);
router.route("/softdeleteSeoKeyword/:id").delete(SoftDeleteSeoKeyword);
module.exports = router;
