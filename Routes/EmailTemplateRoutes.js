const express = require("express");
const router = express.Router();
const {
  EmailTemplateGet,
  CreateEmailTemplate,
  EditEmailTemplate,
  DeleteEmailTemplate,
  SoftDeleteEmailTemplate,
  GetDeletedEmailTemplate,
  RestoreSoftDeletedEmailTemplate,
} = require("../Controller/EmailTemplateController");
const { upload } = require("../Utils/ImageUpload");
router
  .route("/uploadEmailTemplate", upload.single("image"))
  .post(CreateEmailTemplate);
router.route("/EmailTemplategetdeleted").get(GetDeletedEmailTemplate);
router
  .route("/restoresoftdeleteEmailTemplate/:id")
  .post(RestoreSoftDeletedEmailTemplate);
router.route("/EmailTemplateget").get(EmailTemplateGet);
router.route("/deleteEmailTemplate/:id").delete(DeleteEmailTemplate);
router
  .route("/updateEmailTemplate/:id", upload.single("image"))
  .put(EditEmailTemplate);
router.route("/softdeleteEmailTemplate/:id").delete(SoftDeleteEmailTemplate);

module.exports = router;
