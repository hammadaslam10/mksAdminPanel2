const express = require("express");
const router = express.Router();
const {
  RaceNameGet,
  CreateRaceName,
  EditRaceName,
  DeleteRaceName,
  SoftDeleteRaceName,
} = require("../Controller/RaceNameController");
const { upload } = require("../Utils/ImageUpload");

router.route("/uploadRaceName", upload.single("image")).post(CreateRaceName);
router.route("/RaceNameget").get(RaceNameGet);
router.route("/deleteRaceName/:id").delete(DeleteRaceName);
router.route("/updateRaceName/:id", upload.single("image")).put(EditRaceName);
router.route("/softdeleteRaceName/:id").delete(SoftDeleteRaceName);
module.exports = router;
