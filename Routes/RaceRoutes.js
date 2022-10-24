const express = require("express");
const router = express.Router();
const {
  GetRace,
  CreateRace,
  EditRace,
  DeleteRace,
  SingleRace,
  IncludeHorses,
} = require("../Controller/RaceController");
router.route("/getrace").get(GetRace);
router.route("/getsinglerace/:id").get(SingleRace);
router.route("/createrace").post(CreateRace);
router.route("/addracehorses/:id").post(IncludeHorses);
router.route("/updaterace/:id").put(EditRace);
router.route("/deleterace/:id").delete(DeleteRace);
module.exports = router;
