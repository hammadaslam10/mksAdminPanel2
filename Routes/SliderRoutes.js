const express = require("express");
const router = express.Router();
const {
  CreateSlider,
  EditSlider,
  DeleteSlider,
  SliderGet,
  SoftDeleteSlider,
  GetDeletedSlider,
  RestoreSoftDeletedSlider,
} = require("../Controller/SliderController");
const { upload } = require("../Utils/ImageUpload");
router.route("/slidergetdeleted").get(GetDeletedSlider);
router.route("/restoresoftdeleteslider/:id").post(RestoreSoftDeletedSlider);
router.route("/uploadSlider", upload.single("image")).post(CreateSlider);
router.route("/Sliderget").get(SliderGet);
router.route("/deleteSlider/:id").delete(DeleteSlider);
router.route("/softdeleteSlider/:id").delete(SoftDeleteSlider);
router.route("/updateSlider/:id", upload.single("image")).put(EditSlider);

module.exports = router;
