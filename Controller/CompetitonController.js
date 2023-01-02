const db = require("../config/Connection");
const CompetitonModel = db.CompetitonModel;
const RaceModel = db.RaceModel;
const HorseModel = db.HorseModel;
const CompetitionRacesPointsModel = db.CompetitionRacesPointsModel;
const SubscriberAndCompetitionModel = db.SubscriberAndCompetitionModel;
const SubscriberModel = db.SubscriberModel;
const jwt = require("jsonwebtoken");
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const sequelize = require("sequelize");
const { Race, Horse } = require("../Utils/Path");
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
    paranoid: false,
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
    CompetitionType,
    CompetitionSponsor,
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
      CompetitionType: CompetitionType,
      CompetitionSponsor: CompetitionSponsor,
    });
    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(403);
      res.json({
        status: "error",
        message: [
          "This Short Code already exists, Please enter a different one.",
        ],
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
    CompetitionType,
    CompetitionSponsor,
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
    CompetitionType: CompetitionType || data.CompetitionType,
    CompetitionSponsor: CompetitionSponsor || data.CompetitionSponsor,
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
      res.json({
        status: "error",
        message: [
          "This Short Code already exists, Please enter a different one.",
        ],
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
exports.SearchCompetition = Trackerror(async (req, res, next) => {
  ({
    offset: Number(req.query.page) || 0,
    limit: Number(req.query.limit) || 10,
    order: [[req.query.orderby || "createdAt", req.query.sequence || "ASC"]],
    where: {
      NameEn: {
        [Op.like]: `%${req.query.NameEn || ""}%`,
      },
      NameAr: {
        [Op.like]: `%${req.query.NameAr || ""}%`,
      },
      CompetitionCategory: {
        [Op.like]: `%${req.query.CompetitionCategory || ""}%`,
      },
      CompetitionType: {
        [Op.like]: `%${req.query.CompetitionType || ""}%`,
      },
      CompetitionSponsor: {
        [Op.like]: `%${req.query.CompetitionSponsor || ""}%`,
      },
      CompetitionCode: {
        [Op.like]: `%${req.query.CompetitionCode || ""}%`,
      },
      CategoryCount: {
        [Op.like]: `%${req.query.CategoryCount || ""}%`,
      },
      shortCode: {
        [Op.like]: `%${req.query.shortCode || ""}%`,
      },
      createdAt: {
        [Op.between]: [
          req.query.startdate || "2021-12-01 00:00:00",
          req.query.endDate || "4030-12-01 00:00:00",
        ],
      },
      StartDate: {
        [Op.between]: [
          req.query.competitionstartdate1 || "2021-12-01 00:00:00",
          req.query.competitionstartdate2 || "4030-12-01 00:00:00",
        ],
      },
      EndDate: {
        [Op.between]: [
          req.query.competitionenddate1 || "2021-12-01 00:00:00",
          req.query.competitionenddate2 || "4030-12-01 00:00:00",
        ],
      },
      createdAt: {
        [Op.between]: [req.query.startdate, req.query.enddate],
      },
    },
  });
});
exports.Voting = Trackerror(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(
      new HandlerCallBack("Please login to access this resource", 401)
    );
  }
  const { Horse } = req.body;
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decodedData);
  const userdata = await SubscriberModel.findOne({
    where: { [Op.and]: [{ _id: decodedData.id }, { ApprovedStatus: 1 }] },
  });
  if (!userdata) {
    return next(
      new HandlerCallBack("Your are not Eligible to play competition", 401)
    );
  }

  const CompetitionID = await CompetitonModel.findOne({
    where: { _id: req.params.competitionid },
  });
  if (!CompetitionID) {
    return next(new HandlerCallBack("Voting Time is Ended", 401));
  }
  const RaceID = await RaceModel.findOne({
    where: { _id: req.params.raceid },
  });
  if (!RaceID) {
    return next(new HandlerCallBack("Race time is Ended", 401));
  }
  if (CompetitionID.CompetitionCategory === "pick") {
    const HorseID = await HorseModel.findOne({
      where: { _id: Horse },
    });
    if (!HorseID) {
      return next(new HandlerCallBack("Horse is not existed", 401));
    }
    const verification = await SubscriberAndCompetitionModel.findAll({
      where: {
        [Op.and]: [
          { CompetitionID: req.params.competitionid },
          { RaceID: req.params.raceid },
          { SubscriberID: decodedData.id },
        ],
      },
    });
    if (verification.length !== 0) {
      return next(new HandlerCallBack("You Already Voted On this Race", 401));
    }
    const data = await SubscriberAndCompetitionModel.create({
      CompetitionID: req.params.competitionid,
      RaceID: req.params.raceid,
      SubscriberID: decodedData.id,
      HorseID: Horse,
      Rank: 1,
    });
    if (data) {
      res.status(200).json({
        success: true,
        message: `your vote has been submitted on ${HorseID.NameEn}`,
      });
    } else {
      res.status(202).json({
        success: false,
        message: `vote submitted already`,
      });
    }
  } else {
    const { Vote } = req.body;
    let VoteData = Conversion(Vote);
    console.log(Vote);
    console.log(VoteData);
    const verification = await SubscriberAndCompetitionModel.findAll({
      where: {
        [Op.and]: [
          { CompetitionID: req.params.competitionid },
          { RaceID: req.params.raceid },
          { SubscriberID: decodedData.id },
        ],
      },
    });
    if (verification.length !== 0) {
      return next(new HandlerCallBack("You Already Voted On this Race", 401));
    }

    try {
      await SubscriberAndCompetitionModel.findOrCreate({
        where: {
          CompetitionID: req.params.competitionid,
          RaceID: req.params.raceid,
          SubscriberID: decodedData.id,
          HorseID: Horse,
          Rank: req.params.rank,
        },
      });
      res.status(200).json({
        success: false,
        message: `vote has been submitted `,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error,
      });
    }
  }
});
