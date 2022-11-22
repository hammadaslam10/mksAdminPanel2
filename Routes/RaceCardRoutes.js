const express = require("express");
const router = express.Router();
const {
  RaceCardGet,
  CreateRaceCard,
  EditRaceCard,
  DeleteRaceCard,
  SoftDeleteRaceCard,
  AddRacesInRaceCard,
} = require("../Controller/RaceCardController");
const { upload } = require("../Utils/ImageUpload");
router.route("/uploadRaceCard", upload.single("image")).post(CreateRaceCard);
router.route("/RaceCardget").get(RaceCardGet);
router.route("/deleteRaceCard/:id").delete(DeleteRaceCard);
router.route("/addracesinracecard/:id").post(AddRacesInRaceCard);
router.route("/updateRaceCard/:id", upload.single("image")).put(EditRaceCard);
router.route("/softdeleteRaceCard/:id").delete(SoftDeleteRaceCard);
module.exports = router;
