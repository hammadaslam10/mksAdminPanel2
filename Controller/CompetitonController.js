const db = require("../config/Connection");
const CompetitonModel = db.CompetitonModel;
const RaceModel = db.RaceModel;
const CompetitionRacesPointsModel = db.CompetitionRacesPointsModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const sequelize = require("sequelize");
const { Race } = require("../Utils/Path");
exports.GetCompetitonMaxShortCode = Trackerror(async (req, res, next) => {
  const data = await CompetitonModel.findAll({
    attributes: [
      [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
    ],
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.CreateCompetiton = Trackerror(async (req, res, next) => {
  const {
    NameEn,
    NameAr,
    shortCode,
    CompetitionCode,
    DescEn,
    DescAr,
    pickCount,
    TriCount,
    StartDate,
    CompetitionCategory,
  } = req.body;
  if (ArRegex.test(NameAr) && ArRegex.test(NameEn) == false) {
    const data = await CompetitonModel.create({
      shortCode: shortCode,
      NameEn: NameEn,
      NameAr: NameAr,
      DescEn: DescEn,
      DescAr: DescAr,
      pickCount: pickCount,
      TriCount: TriCount,
      StartDate: StartDate,
      CompetitionCode: CompetitionCode,
      CompetitionCategory: CompetitionCategory,
    });
    res.status(201).json({
      success: true,
      data,
    });
  } else {
    return next(
      new HandlerCallBack("Please Fill Data To appropiate fields", 404)
    );
  }
});
exports.CompetitonGet = Trackerror(async (req, res, next) => {
  const data = await CompetitonModel.findAll({
    include: { all: true },
  });
  res.status(200).json({
    success: true,
    data: data,
  });
});

exports.AddRacesInCompetition = Trackerror(async (req, res, next) => {
  let CompetitionID = await CompetitonModel.findOne({
    where: { _id: req.params.id },
  });
  if (!CompetitionID) {
    return next(new HandlerCallBack("Race Card not found", 404));
  } else {
    let { RaceEntry } = req.body;
    let RaceEntryData = Conversion(RaceEntry);
    await RaceEntryData.map(async (singlerace) => {
      await RaceModel.update(
        { Competition: CompetitionID },
        {
          where: {
            _id: singlerace,
          },
        }
      );
    });
  }
  res.status(200).json({
    success: true,
    message: "Comeptition Races Added",
  });
});
exports.SingleCompetitonGet = Trackerror(async (req, res, next) => {
  const data = await CompetitonModel.findAll({
    where: { _id: req.params.id },
    include: { all: true },
  });
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.GetCompetitonAdmin = Trackerror(async (req, res, next) => {});
exports.EditCompetiton = Trackerror(async (req, res, next) => {
  const {
    NameEn,
    NameAr,
    shortCode,
    CompetitionCode,
    DescEn,
    DescAr,
    pickCount,
    TriCount,
    StartDate,
    CompetitionCategory,
  } = req.body;

  let data = await CompetitonModel.findOne({
    where: { _id: req.params.id },
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const updateddata = {
    shortCode: shortCode || data.shortCode,
    NameEn: NameEn || data.NameEn,
    DescEn: DescEn || data.DescEn,
    pickCount: pickCount || data.pickCount,
    DescAr: DescAr || data.DescAr,
    NameAr: NameAr || data.NameAr,
    CompetitionCode: CompetitionCode || data.CompetitionCode,
    TriCount: TriCount || data.TriCount,
    StartDate: StartDate || data.StartDate,
    CompetitionCategory: CompetitionCategory || data.CompetitionCategory,
  };
  data = await CompetitonModel.update(updateddata, {
    where: {
      _id: req.params.id,
    },
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.DeleteCompetiton = Trackerror(async (req, res, next) => {
  const data = await CompetitonModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await CompetitonModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteCompetiton = Trackerror(async (req, res, next) => {
  const data = await CompetitonModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await CompetitonModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "Soft Delete Successfully",
  });
});
