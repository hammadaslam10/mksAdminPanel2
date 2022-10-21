const RaceModel = require("../Models/RaceModel");
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const RaceCourseModel = require("../Models/RaceCourseModel");
const TrainerModel = require("../Models/TrainerModel");
const JockeyModel = require("../Models/JockeyModel");
const OwnerModel = require("../Models/OwnerModel");
const HorseModel = require("../Models/HorseModel");
const { getObjectSignedUrl } = require("../Utils/s3");
const { Trainer, Jockey, Owner, Horse, RaceCourse } = require("../Utils/Path");

const Features = require("../Utils/Features");
exports.GetRace = Trackerror(async (req, res, next) => {});
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
    Horses: Horses,
    Prizes: Prizes,
    RaceStatus: RaceStatus,
    DayNTime: DayNTime,
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.EditRace = Trackerror(async (req, res, next) => {});
exports.DeleteRace = Trackerror(async (req, res, next) => {});
