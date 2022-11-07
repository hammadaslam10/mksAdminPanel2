const express = require("express");
const router = express.Router();
const {
  ColorGet,
  CreateColor,
  EditColor,
  DeleteColor,
  SoftDeleteColor,
} = require("../Controller/ColorController");
const { upload } = require("../Utils/ImageUpload");

router.route("/uploadColor", upload.single("image")).post(CreateColor);
router.route("/Colorget").get(ColorGet);
router.route("/deleteColor/:id").delete(DeleteColor);
router.route("/updateColor/:id", upload.single("image")).put(EditColor);
router.route("/softdeleteColor/:id").delete(SoftDeleteColor);
module.exports = router;
