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
  SoftDeleteRace,
  RaceWithTime,
  GetHorsesofraces,
  GetRaceWithStartTime,
  ResultLatest,
  VerdictLatest,
  GetDeletedRace,
  RestoreSoftDeletedRace,
  AddPointTable,
  SearchRace,
  AddRaceImage,
  CancelRace,
  Getracehorses,
  EditRaceHorses,
  EditRaceVerdict,
  GetEditRaceVerdict,
  GetEditRaceHorses,
  RacePredictor,
  HorsesInRace,
  HorseHistory,
  EditRaceHorsesv2
} = require("../Controller/RaceController");
const { upload } = require("../Utils/ImageUpload");
router.route("/horsehistory/:horseid").get(HorseHistory);

router.route("/GetEditRaceHorses/:id").get(GetEditRaceHorses);
router.route("/EditRaceHorses/:id").put(EditRaceHorsesv2);
router.route("/GetEditRaceVerdict/:id").get(GetEditRaceVerdict);
router.route("/EditRaceVerdict/:id").put(EditRaceVerdict);
router.route("/RacePredictor/:id").get(RacePredictor);

router.route("/racegetdeleted").get(GetDeletedRace);
router.route("/restoresoftdeleterace/:id").post(RestoreSoftDeletedRace);
router.route("/SearchRace").get(SearchRace);
router.route("/getrace").get(GetRace);
router.route("/getracehorses/:id").get(Getracehorses);
router.route("/getlatestraceresult").get(ResultLatest);
router.route("/raceprediction").get(VerdictLatest);
router.route("/getracewithtime").get(RaceWithTime);
router.route("/GetRaceWithStartTime").post(GetRaceWithStartTime);
router.route("/GetHorsesofraces").get(GetHorsesofraces);
router.route("/GetRaceResultToBeAnnounced").get(GetRaceResultToBeAnnounced);
router.route("/GetRaceTobeOPublished").get(GetRaceTobeOPublished);
router.route("/getracetobepublished").get(GetRaceTobeOPublished);
router.route("/publishedracesbycountry").get(RaceOrderByCountry);
router.route("/raceCart/:RaceCourseName").get(RaceOrderByRaceCourseOnly);
router.route("/publishrace/:id").put(PublishRaces);
router.route("/AddRaceImage/:id").post(AddRaceImage);
router.route("/getsinglerace/:id").get(SingleRace);
router.route("/createrace", upload.single("image")).post(CreateRace);
router.route("/createraceresult/:RaceId").post(ResultCreation);
router.route("/addracehorses/:id").post(IncludeHorses);
router.route("/addverdicts/:id").post(IncludeVerdicts);
router.route("/AddPointTable/:id").post(AddPointTable);
router.route("/updaterace/:id").put(EditRace);
router.route("/cancelrace/:id").put(CancelRace);
router.route("/deleterace/:id").delete(DeleteRace);
router.route("/softdeleterace/:id").delete(SoftDeleteRace);
router
  .route("/getracesthroughracecourseandtime/:RaceCourseid/:DayNTime")
  .post(GetRaceonTimeAndRaceCourse);
module.exports = router;
