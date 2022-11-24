const express = require("express");
const router = express.Router();
const {
  GetRace,
  CreateRace,
  EditRace,
  DeleteRace,
  SingleRace,
  IncludeHorses,
  PublishRaces,
  RaceOrderByCountry,
  RaceOrderByRaceCourseOnly,
  ResultCreation,
  GetRaceTobeOPublished,
  IncludeVerdicts,
  GetRaceResultToBeAnnounced,
  GetRaceonTimeAndRaceCourse,
} = require("../Controller/RaceController");
const { upload } = require("../Utils/ImageUpload");
router.route("/getrace").get(GetRace);
router.route("/GetRaceResultToBeAnnounced").get(GetRaceResultToBeAnnounced);
router.route("/GetRaceTobeOPublished").get(GetRaceTobeOPublished);
router.route("/getracetobepublished").get(GetRaceTobeOPublished);
router.route("/publishedracesbycountry").get(RaceOrderByCountry);
router.route("/raceCart/:RaceCourseName").get(RaceOrderByRaceCourseOnly);
router.route("/publishrace/:id").put(PublishRaces);
router.route("/getsinglerace/:id").get(SingleRace);
router.route("/createrace", upload.single("image")).post(CreateRace);
router.route("/createraceresult/:RaceId").post(ResultCreation);
router.route("/addracehorses/:id").post(IncludeHorses);
router.route("/addverdicts/:id").post(IncludeVerdicts);
router.route("/updaterace/:id").put(EditRace);
router.route("/deleterace/:id").delete(DeleteRace);
router
  .route("/getracesthroughracecourseandtime/:RaceCourseid/:DayNTime")
  .post(GetRaceonTimeAndRaceCourse);
module.exports = router;
