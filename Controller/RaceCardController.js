const db = require("../config/Connection");
const RaceCardModel = db.RaceCardModel;
const RaceCardRacesModel = db.RaceCardRacesModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const { Conversion } = require("../Utils/Conversion");
const { Op } = require("sequelize");
exports.GetDeletedRaceCard = Trackerror(async (req, res, next) => {
  const data = await RaceCardModel.findAll({
    paranoid: false,
    where: {
      [Op.not]: { deletedAt: null },
    },
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.RestoreSoftDeletedRaceCard = Trackerror(async (req, res, next) => {
  const data = await RaceCardModel.findOne({
    paranoid: false,
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const restoredata = await RaceCardModel.restore({
    where: { _id: req.params.id },
  });
  res.status(200).json({
    success: true,
    restoredata,
  });
});

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
exports.SearchRaceCard = Trackerror(async (req, res, next) => {
  const totalcount = await RaceCardModel.count();
  const data = await RaceCardModel.findAll({
    offset: Number(req.query.page) - 1 || 0,
    limit: Number(req.query.limit) || 10,
    order: [[req.query.orderby || "createdAt", req.query.sequence || "ASC"]],
    where: {
      RaceCardNameEn: {
        [Op.like]: `%${req.query.RaceCardNameEn || ""}%`,
      },
      RaceCardNameAr: {
        [Op.like]: `%${req.query.RaceCardNameAr || ""}%`,
      },
      RaceCardCourse: {
        [Op.like]: `%${req.query.RaceCardCourse || ""}%`,
      },
      createdAt: {
        [Op.between]: [
          req.query.startdate || "2021-12-01 00:00:00",
          req.query.endDate || "4030-12-01 00:00:00",
        ],
      },
    },
  });
  res.status(200).json({
    success: true,
    data: data,
    totalcount,
    filtered: data.length,
  });
});
exports.RaceCardGet = Trackerror(async (req, res, next) => {
  const data = await RaceCardModel.findAll({
    include: [
      {
        model: db.RaceModel,
        as: "RaceCardRacesModelData",
        where: { HorseFilled: true },
        include: [
          {
            paranoid: false,
            model: db.MeetingTypeModel,
            as: "MeetingTypeData",
          },
          // {
          //   paranoid: false,
          //   model: db.GroundTypeModel,
          //   as: "GroundData",
          // },
          {
            model: db.RaceCourseModel,
            as: "RaceCourseData",
            paranoid: false,
          },
          {
            paranoid: false,
            model: db.TrackLengthModel,
            as: "TrackLengthData",
          },
          {
            paranoid: false,
            model: db.RaceNameModel,
            as: "RaceNameModelData",
          },
          {
            paranoid: false,
            model: db.RaceKindModel,
            as: "RaceKindData",
          },
          {
            model: db.RaceTypeModel,
            as: "RaceTypeModelData",
          },
          {
            paranoid: false,
            model: db.SponsorModel,
            as: "SponsorData",
          },
          {
            model: db.HorseModel,
            as: "RaceAndHorseModelData",
            include: { all: true },
            paranoid: false,
          },
          {
            model: db.JockeyModel,
            include: { all: true },
            paranoid: false,
          },
          {
            model: db.ResultModel,
            as: "RaceResultData",
            include: { all: true },
            paranoid: false,
          },
        ],
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
