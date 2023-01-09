const express = require("express");
const router = express.Router();
const {
  ColorGet,
  CreateColor,
  EditColor,
  DeleteColor,
  SoftDeleteColor,
  SingleColor,
  GetColorMaxShortCode,
  GetDeletedColor,
  RestoreSoftDeletedColor,
  ColorMassUpload,
} = require("../Controller/ColorController");
const { upload } = require("../Utils/ImageUpload");
router.route("/colorgetdeleted").get(GetDeletedColor);
router.route("/restoresoftdeletecolor/:id").post(RestoreSoftDeletedColor);
router.route("/getsinglecolor/:id").get(SingleColor);
router.route("/getcolorshortcode").get(GetColorMaxShortCode);
router.route("/uploadColor", upload.single("image")).post(CreateColor);
router.route("/ColorMassUpload", upload.single("image")).post(ColorMassUpload);
router.route("/Colorget").get(ColorGet);
router.route("/deleteColor/:id").delete(DeleteColor);
router.route("/updateColor/:id", upload.single("image")).put(EditColor);
router.route("/softdeleteColor/:id").delete(SoftDeleteColor);
module.exports = router;
