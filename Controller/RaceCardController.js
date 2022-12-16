const db = require("../config/Connection");
const RaceCardModel = db.RaceCardModel;
const RaceCardRacesModel = db.RaceCardRacesModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const { Conversion } = require("../Utils/Conversion");
const { Op } = require("sequelize");
exports.CreateRaceCard = Trackerror(async (req, res, next) => {
  const { RaceCardNameEn, RaceCardNameAr, RaceCardCourse } = req.body;
  
    const data = await RaceCardModel.create({
      RaceCardCourse: RaceCardCourse,
      RaceCardNameEn: RaceCardNameEn,
      RaceCardNameAr: RaceCardNameAr,
    });
    res.status(201).json({
      success: true,
      data,
    });
  
});
exports.RaceCardGet = Trackerror(async (req, res, next) => {
  const data = await RaceCardModel.findAll({
    include: [
      {
        model: db.RaceModel,
        as: "RaceCardRacesModelData",
        include: { all: true },
      },
      {
        model: db.RaceCourseModel,
        as: "RaceCardCourseData",
      },
    ],
  });
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.AddRaces = Trackerror(async (req, res, next) => {
  let RaceCardID = await RaceCardModel.findOne({
    where: { _id: req.params.id },
  });
  if (!RaceCardID) {
    return next(new HandlerCallBack("Race Card not found", 404));
  } else {
    let { RaceEntry } = req.body;
    let RaceEntryData = Conversion(RaceEntry);
    await RaceEntryData.map(async (singlerace) => {
      await RaceCardRacesModel.findOrCreate({
        where: {
          RaceCardModelId: req.params.id,
          RaceModelId: singlerace,
        },
      });
    });
    res.status(200).json({
      success: true,
      msg: "Races Get Added",
    });
  }
});
exports.GetRaceCardAdmin = Trackerror(async (req, res, next) => {});
exports.EditRaceCard = Trackerror(async (req, res, next) => {
  const { RaceCardNameEn, RaceCardNameAr, RaceCardCourse } = req.body;
  let data = await RaceCardModel.findOne({
    where: { _id: req.params.id },
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const updateddata = {
    RaceCardCourse: RaceCardCourse || data.RaceCardCourse,
    RaceCardNameEn: RaceCardNameEn || data.RaceCardNameEn,
    RaceCardNameAr: RaceCardNameAr || data.RaceCardNameAr,
  };
  data = await RaceCardModel.update(updateddata, {
    where: {
      _id: req.params.id,
    },
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.DeleteRaceCard = Trackerror(async (req, res, next) => {
  const data = await RaceCardModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await RaceCardModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteRaceCard = Trackerror(async (req, res, next) => {
  const data = await RaceCardModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await RaceCardModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "Soft Delete Successfully",
  });
});
exports.AddRacesInRaceCard = Trackerror(async (req, res, next) => {
  let RaceCardID = await RaceCardModel.findOne({
    where: { _id: req.params.id },
  });
  if (!RaceCardID) {
    return next(new HandlerCallBack("Race Card not found", 404));
  } else {
    let { RaceEntry } = req.body;
    let RaceEntryData = Conversion(RaceEntry);
    await RaceEntryData.map(async (singlerace) => {
      await RaceCardRacesModel.findOrCreate({
        where: {
          RaceCardModelId: req.params.id,
          RaceModelId: singlerace,
        },
      });
    });
    res.status(200).json({
      success: true,
      msg: "Races Get Added",
    });
  }
});
