const express = require("express");
const router = express.Router();
const {
  BreederGet,
  CreateBreeder,
  EditBreeder,
  DeleteBreeder,
  SoftDeleteBreeder,
} = require("../Controller/BreederController");
const { upload } = require("../Utils/ImageUpload");

router.route("/uploadBreeder", upload.single("image")).post(CreateBreeder);
router.route("/Breederget").get(BreederGet);
router.route("/deleteBreeder/:id").delete(DeleteBreeder);
router.route("/updateBreeder/:id", upload.single("image")).put(EditBreeder);
router.route("/softdeleteBreeder/:id").delete(SoftDeleteBreeder);
module.exports = router;
