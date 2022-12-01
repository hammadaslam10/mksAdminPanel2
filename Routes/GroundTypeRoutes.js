const express = require("express");
const router = express.Router();
const {
  GroundTypeGet,
  CreateGroundType,
  EditGroundType,
  DeleteGroundType,
  SoftDeleteGroundType,
  GetGroundTypeMaxShortCode,
} = require("../Controller/GroundTypeController");
const { upload } = require("../Utils/ImageUpload");
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
