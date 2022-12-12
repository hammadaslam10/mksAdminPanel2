const db = require("../config/Connection");
const CompetitonModel = db.CompetitonModel;
const RaceModel = db.RaceModel;
const CompetitionRacesPointsModel = db.CompetitionRacesPointsModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const sequelize = require("sequelize");
const { Race } = require("../Utils/Path");
const { Conversion } = require("../Utils/Conversion");
const { Op } = require("sequelize");
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
exports.GetRaceforCompetition = Trackerror(async (req, res, next) => {
  const { Raceids, RaceName } = req.body;
  const data = await RaceModel.findAll({
    where: {
      [Op.and]: [
        {
          _id: {
            [Op.ne]: Raceids,
          },
        },
      ],
    },
    inlucude: [
      {
        model: db.RaceNameModel,
        as: "RaceNameModelData",
        where: {
          [Op.or]: [
            {
              NameEn: {
                [Op.like]: `%${RaceName}%`,
              },
              NameEn: {
                [Op.like]: `%${RaceName}%`,
              },
            },
          ],
        },
      },
    ],
  });
  res.status(200).json({
    success: true,
    data: data,
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
    try {
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
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        res.status(403);
        res.send({
          status: "error",
          message:
            "This Short Code already exists, Please enter a different one.",
        });
      }
    }
  } else {
    return next(
      new HandlerCallBack("Please Fill Data To appropiate fields", 404)
    );
  }
});
exports.CompetitonGet = Trackerror(async (req, res, next) => {
  const data = await CompetitonModel.findAll({
    include: [
      {
        model: db.CompetitionCategoryModel,
        as: "CompetitionCategoryData",
      },
      {
        model: db.RaceModel,
        as: "CompetitionRacesPointsModelData",

        include: [
          {
            model: db.RaceNameModel,
            as: "RaceNameModelData",
          },
        ],
      },
    ],
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
    let { CastRaces, PickRaces } = req.body;
    let CastRacesData = Conversion(CastRaces);
    let PickRacesData = Conversion(PickRaces);

    if (CastRacesData[0].length > 0) {
      let CastRacesData = Conversion(CastRaces);
      console.log(CastRacesData, "CastRacesData");
      await CastRacesData.map(async (singlerace) => {
        await singlerace.map(async (singleracedetail) => {
          singleracedetail = singleracedetail.split(",");
          await CompetitionRacesPointsModel.findOrCreate({
            where: {
              CompetitonModelId: req.params.id,
              RaceModelId: singleracedetail[0],
              Points: singleracedetail[1],
              BonusPoints: singleracedetail[2],
              Type: "cast",
              Length: CastRacesData[0].length,
            },
          });
        });
      });
    } else {
    }
    if (PickRaces.length > 0) {
      if (PickRacesData.length > 0) {
        console.log(CompetitionID.pickCount)
        if (CompetitionID.pickCount === PickRacesData.length) {
          let PickRacesData = Conversion(PickRaces);
          console.log(PickRacesData, "PickRacesData");
          await PickRacesData.map(async (singlerace) => {
            await singlerace.map(async (singleracedetail) => {
              singleracedetail = singleracedetail.split(",");
              await CompetitionRacesPointsModel.findOrCreate({
                where: {
                  CompetitonModelId: req.params.id,
                  RaceModelId: singleracedetail[0],
                  Points: singleracedetail[1],
                  BonusPoints: singleracedetail[2],
                  Type: "pick",
                  Length: PickRacesData[0].length,
                },
              });
            });
          });
        } else {
          return next(
            new HandlerCallBack("Pick Races Length Is Exceeded", 404)
          );
        }
      }
    } else {
    }
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
  try {
    data = await CompetitonModel.update(updateddata, {
      where: {
        _id: req.params.id,
      },
    });
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(403);
      res.send({
        status: "error",
        message:
          "This Short Code already exists, Please enter a different one.",
      });
    } else {
      res.status(500);
      res.send({ status: "error", message: "Something went wrong" });
    }
  }
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
