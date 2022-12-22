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
exports.GetDeletedCompetiton = Trackerror(async (req, res, next) => {
  const data = await CompetitonModel.findAll({
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
exports.RestoreSoftDeletedCompetiton = Trackerror(async (req, res, next) => {
  const data = await CompetitonModel.findOne({
    paranoid: false,
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const restoredata = await CompetitonModel.restore({
    where: { _id: req.params.id },
  });
  res.status(200).json({
    success: true,
    restoredata,
  });
});

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
    CategoryCount,
    EndDate,
    StartDate,
    CompetitionCategory,
  } = req.body;

  try {
    const data = await CompetitonModel.create({
      shortCode: shortCode,
      NameEn: NameEn,
      NameAr: NameAr,
      DescEn: DescEn,
      DescAr: DescAr,
      CategoryCount: CategoryCount,
      EndDate: EndDate,
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
    } else {
      res.status(500).json({
        success: false,
        message: error.errors.map((singleerr) => {
          return singleerr.message;
        }),
      });
    }
  }
});
exports.CompetitonGet = Trackerror(async (req, res, next) => {
  const data = await CompetitonModel.findAll({
    include: [
      // {
      //   model: db.CompetitionCategoryModel,
      //   as: "CompetitionCategoryData",
      // },
      {
        model: db.RaceModel,
        as: "CompetitionRacesPointsModelData",

        include: [
          {
            paranoid: false,
            model: db.RaceNameModel,
            as: "RaceNameModelData",
          },

          {
            paranoid: false,
            model: db.HorseModel,
            as: "RaceAndHorseModelData",
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
    console.log(CastRaces);
    console.log(PickRaces);
    if (CastRaces.length > 0) {
      await CastRaces.map(async (singlerace) => {
        console.log(singlerace, "cast");
        await CompetitionRacesPointsModel.findOrCreate({
          where: {
            CompetitonModelId: req.params.id,
            RaceModelId: singlerace,
            Type: "cast",
          },
        });
      });
    } else {
    }

    if (PickRaces.length > 0) {
      console.log(CompetitionID.CategoryCount);
      if (CompetitionID.CategoryCount === PickRaces.length) {
        await PickRaces.map(async (singlerace) => {
          console.log(singlerace, "pick");
          await CompetitionRacesPointsModel.findOrCreate({
            where: {
              CompetitonModelId: req.params.id,
              RaceModelId: singlerace,
              Type: "pick",
            },
          });
        });
      } else {
        return next(new HandlerCallBack("Pick Races Length Is Exceeded", 404));
      }
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
    CategoryCount,
    EndDate,
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
    CategoryCount: CategoryCount || data.CategoryCount,
    DescAr: DescAr || data.DescAr,
    NameAr: NameAr || data.NameAr,
    CompetitionCode: CompetitionCode || data.CompetitionCode,
    EndDate: EndDate || data.EndDate,
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
      res.status(500).json({
        success: false,
        message: error.errors.map((singleerr) => {
          return singleerr.message;
        }),
      });
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
