const db = require("../config/Connection");
const RaceModel = db.RaceModel;
const RaceAndHorseModel = db.RaceAndHorseModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { getObjectSignedUrl } = require("../Utils/s3");
const { Trainer, Jockey, Owner, Horse, RaceCourse } = require("../Utils/Path");
const Features = require("../Utils/Features");
const { Conversion } = require("../Utils/Conversion");
exports.GetRace = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findAll({
    include: { all: true },
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.SingleRace = Trackerror(async (req, res, next) => {});
exports.CreateRace = Trackerror(async (req, res, next) => {
  const {
    RaceKind,
    raceName,
    Description,
    RaceCourse,
    Weather,
    Horses,
    Prizes,
    RaceStatus,
    DayNTime,
  } = req.body;
  const data = await RaceModel.create({
    RaceKind: RaceKind,
    raceName: raceName,
    Description: Description,
    RaceCourse: RaceCourse,
    Weather: Weather,
    Prizes: Prizes,
    RaceStatus: RaceStatus,
    DayNTime: DayNTime,
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.IncludeHorses = Trackerror(async (req, res, next) => {
  // const RaceId = await RaceModel.findOne({
  //   where: { _id: req.params.id },
  // });

  const { HorseEntry } = req.body;
  let HorseEntryData = Conversion(HorseEntry);
  console.log(HorseEntryData);
  await HorseEntryData.map(async (SingleEntry) => {
    console.log(SingleEntry);
    await RaceAndHorseModel.create({
      GateNo: 1,
      RaceModelId: req.params.id,
      HorseModelId: SingleEntry,
    });
  });

  res.status(200).json({
    success: true,
  });
});
exports.EditRace = Trackerror(async (req, res, next) => {});
exports.DeleteRace = Trackerror(async (req, res, next) => {});
