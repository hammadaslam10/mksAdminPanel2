const express = require("express");
const router = express.Router();
const {
  GroundTypeGet,
  CreateGroundType,
  EditGroundType,
  DeleteGroundType,
  SoftDeleteGroundType,
  GetGroundTypeMaxShortCode,
  GetDeletedGroundType,
  RestoreSoftDeletedGroundType,
  GroundTypeMassUpload,
} = require("../Controller/GroundTypeController");
const { upload } = require("../Utils/ImageUpload");
router.route("/groundtypegetdeleted").get(GetDeletedGroundType);
router
  .route("/restoresoftdeletegroundtype/:id")
  .post(RestoreSoftDeletedGroundType);
router.route("/GroundTypeMassUpload").post(GroundTypeMassUpload);
router.route("/getgroundtypeshortcode").get(GetGroundTypeMaxShortCode);
router
  .route("/uploadGroundType", upload.single("image"))
  .post(CreateGroundType);
router.route("/GroundTypeget").get(GroundTypeGet);
router.route("/deleteGroundType/:id").delete(DeleteGroundType);
router
  .route("/updateGroundType/:id", upload.single("image"))
  .put(EditGroundType);
router.route("/softdeleteGroundType/:id").delete(SoftDeleteGroundType);
module.exports = router;
