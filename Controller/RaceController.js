const db = require("../config/Connection");
const RaceModel = db.RaceModel;
const SubscriberModel = db.SubscriberModel;
const HorseModel = db.HorseModel;
const ResultModel = db.ResultModel;
const RaceAndPointsSystemModel = db.RaceAndPointsSystemModel;
const SubscriberAndCompetitionModel = db.SubscriberAndCompetitionModel;
const RaceAndHorseModel = db.RaceAndHorseModel;
const HorseAndRaceModel = db.HorseAndRaceModel;
const RaceAndJockeyModel = db.RaceAndJockeyModel;
const RaceCourseModel = db.RaceCourseModel;
const ResultsModel = db.ResultModel;
const RaceResultImagesModel = db.RaceResultImagesModel;
const RaceAndVerdictsHorseModel = db.RaceAndVerdictsHorseModel;
const RaceAndVerdictsJockeyModel = db.RaceAndVerdictsJockeyModel;
const { Race, RaceImages } = require("../Utils/Path");
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { Trainer, Jockey, Owner, Horse, RaceCourse } = require("../Utils/Path");
const Features = require("../Utils/Features");
const { Conversion } = require("../Utils/Conversion");
const { uploadFile, deleteFile } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
const { getPagination, getPagingData1 } = require("../Utils/Pagination");
exports.AllDeclaredRaces = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findAll({
    where: { ResultStatus: "Announced" },
    include: [
      {
        separate: true,
        model: db.ResultModel,
        as: "RaceResultData",
        attributes: [
          "Rating",
          "_id",
          "RaceTime",
          "CumulativeDistance",
          "Distance",
          "PrizeWin",
        ],
        order: ["CumulativeDistance", "ASC"],
        include: [
          {
            model: db.HorseModel,
            as: "HorseIDData",

            attributes: ["_id", "NameEn", "NameAr"],
          },
          {
            model: db.HorseModel,
            as: "BeatenByData",
            attributes: ["_id", "NameEn", "NameAr"],
          },
          {
            model: db.FinalPositionModel,
            as: "FinalPositionDataHorse",
            attributes: ["_id", "NameEn", "Rank"],
          },
        ],
        order: [["FinalPositionDataHorse", "Rank", "ASC"]],
      },
      {
        model: db.RaceNameModel,
        as: "RaceNameModelData",
        attributes: ["_id", "NameEn", "NameAr"],
      },
    ],
    attributes: ["_id"],
  });

  res.status(200).json({
    success: true,
    data,
  });
});
exports.GetDeletedRace = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findAll({
    paranoid: false,
    where: {
      [Op.not]: { deletedAt: null },
    },
    include: [
      {
        model: db.MeetingTypeModel,
        as: "MeetingTypeData",
      },
      // {
      //   model: db.GroundTypeModel,
      //   as: "GroundData"
      // },
      {
        model: db.RaceCourseModel,
        as: "RaceCourseData",
        paranoid: false,
      },
      {
        model: db.TrackLengthModel,
        as: "TrackLengthData",
      },
      {
        model: db.RaceNameModel,
        as: "RaceNameModelData",
      },
      {
        model: db.RaceKindModel,
        as: "RaceKindData",
      },
      {
        model: db.RaceTypeModel,
        as: "RaceTypeModelData",
      },
      {
        model: db.SponsorModel,
        as: "SponsorData",
      },
      {
        model: db.HorseModel,
        as: "RaceAndHorseModelData",
        include: {
          all: true,
        },
        paranoid: false,
      },
      {
        model: db.JockeyModel,
        include: { all: true },
        paranoid: false,
      },
      {
        model: db.HorseAndRaceModel,
        as: "RacehorsesData",
        include: { all: true },
      },
      {
        model: db.ResultModel,
        as: "RaceResultData",
        include: { all: true },
        paranoid: false,
      },
    ],
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.SearchRace = Trackerror(async (req, res, next) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page - 1, size);
  let counttotal = await RaceModel.count();
  const data = await RaceModel.findAndCountAll({
    attributes: {
      exclude: [
        "MeetingType",
        "RaceKind",
        "RaceName",
        "TrackLength",
        "HorseKindinRace",
        "Currency",
        "RaceCourse",
        "RaceType",
        "TrackCondition",
        "Sponsor",
        "updatedAt",
        "deletedAt",
        "Competition",
        "RaceCard",
        "BackupId",
      ],
    },
    include: [
      {
        model: db.HorseKindModel,
        as: "HorseKindinRaceData",
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
        paranoid: false,
      },
      {
        model: db.RaceCourseModel,
        as: "RaceCourseData",
        attributes: {
          exclude: [
            "ColorCode",
            "NationalityID",
            "shortCode",
            "AbbrevEn",
            "AbbrevAr",
            "createdAt",
            "updatedAt",
            "deletedAt",
          ],
        },
        paranoid: false,
      },
      {
        model: db.TrackLengthModel,
        as: "TrackLengthData",
        attributes: {
          exclude: ["GroundType", "createdAt", "updatedAt", "deletedAt"],
        },
        paranoid: false,
      },
      {
        model: db.RaceNameModel,
        as: "RaceNameModelData",
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
        paranoid: false,
      },
      {
        model: db.TrackConditionModel,
        as: "TrackConditionData",
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
        paranoid: false,
      },
      {
        model: db.CurrencyModel,
        as: "CurrencyData",
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
        paranoid: false,
      },
      {
        model: db.RaceKindModel,
        as: "RaceKindData",
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
        paranoid: false,
      },
      {
        model: db.MeetingTypeModel,
        as: "MeetingTypeData",
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
      },
      {
        model: db.RaceTypeModel,
        as: "RaceTypeModelData",
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
        paranoid: false,
      },
      {
        model: db.SponsorModel,
        as: "SponsorData",
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "deletedAt",
            "DescriptionEn",
            "DescriptionAr",
          ],
        },
        paranoid: false,
      },
      {
        model: db.CompetitonModel,
        as: "CompetitionRacesPointsModelData",
        include: { all: true },
        paranoid: false,
      },
      {
        model: db.ResultModel,
        as: "RaceResultData",
        include: { all: true },
        paranoid: false,
      },
      {
        model: db.HorseAndRaceModel,
        as: "RacehorsesData",
        attributes: {
          exclude: [
            "RaceModelId",
            "HorseModelId",
            "Equipment",
            "TrainerOnRace",
            "JockeyOnRace",
            "OwnerOnRace",
          ],
        },

        include: [
          {
            model: db.EquipmentModel,
            as: "EquipmentData1",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt", "BackupId"],
            },
          },
          {
            model: db.HorseModel,
            as: "HorseModelIdData1",
            attributes: ["NameEn", "NameAr", "_id", "DOB", "HorseImage"],
            include: [
              {
                model: db.HorseModel,
                as: "DamData",
                attributes: {
                  exclude: ["createdAt", "updatedAt", "deletedAt"],
                },
              },
              {
                model: db.test,
                as: "TrackHorses",
                attributes: {
                  exclude: ["createdAt", "updatedAt", "deletedAt"],
                },
              },
              {
                model: db.NationalityModel,
                as: "NationalityData",
                attributes: {
                  exclude: ["createdAt", "updatedAt", "deletedAt"],
                },
              },
              {
                model: db.BreederModel,
                as: "BreederData",
                attributes: {
                  exclude: ["createdAt", "updatedAt", "deletedAt"],
                },
              },
              {
                model: db.HorseModel,
                as: "SireData",
                attributes: {
                  exclude: ["createdAt", "updatedAt", "deletedAt"],
                },
              },
              {
                model: db.HorseModel,
                as: "GSireData",
                attributes: {
                  exclude: ["createdAt", "updatedAt", "deletedAt"],
                },
              },
            ],
          },
          {
            model: db.TrainerModel,
            as: "TrainerOnRaceData1",
            attributes: ["NameEn", "NameAr", "_id", "BackupId", "image"],
          },
          {
            model: db.JockeyModel,
            as: "JockeyOnRaceData1",
            attributes: {
              exclude: [
                "createdAt",
                "updatedAt",
                "deletedAt",
                "shortCode",
                "JockeyLicenseDate",
                "RemarksEn",
                "Rating",
                "NationalityID",
                "BackupId",
              ],
            },
          },
          {
            model: db.OwnerModel,
            as: "OwnerOnRaceData1",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt", "BackupId"],
            },
          },
          {
            model: db.ColorModel,
            as: "CapColorData1",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt", "BackupId"],
            },
          },
        ],
        paranoid: false,
      },
    ],
    order: [[req.query.orderby || "createdAt", req.query.sequence || "ASC"]],
    where: {
      MeetingType: {
        [Op.like]: `%${req.query.MeetingType || ""}%`,
      },
      MeetingCode: {
        [Op.like]: `%${req.query.MeetingCode || ""}%`,
      },
      RaceName: {
        [Op.like]: `%${req.query.RaceName || ""}%`,
      },
      TrackLength: {
        [Op.like]: `%${req.query.TrackLength || ""}%`,
      },
      // Ground: {
      //   [Op.like]: `%${req.query.Ground || ""}%`
      // },
      DescriptionAr: {
        [Op.like]: `%${req.query.DescriptionAr || ""}%`,
      },
      DescriptionEn: {
        [Op.like]: `%${req.query.DescriptionEn || ""}%`,
      },
      // RaceStatus: {
      //   [Op.like]: `%${req.query.RaceStatus || ""}%`,
      // },
      // ResultStatus: {
      //   [Op.like]: `%${req.query.ResultStatus || ""}%`,
      // },
      RaceCourse: {
        [Op.like]: `%${req.query.RaceCourse || ""}%`,
      },
      RaceType: {
        [Op.like]: `%${req.query.RaceType || ""}%`,
      },
      // HorseFilled: {
      //   [Op.like]: `%${req.query.HorseFilled || ""}%`,
      // },
      WeatherType: {
        [Op.like]: `%${req.query.WeatherType || ""}%`,
      },
      WeatherDegree: {
        [Op.like]: `%${req.query.WeatherDegree || ""}%`,
      },
      RaceType: {
        [Op.like]: `%${req.query.RaceType || ""}%`,
      },
      // PointTableSystem: {
      //   [Op.like]: `%${req.query.PointTableSystem || ""}%`,
      // },
      // RaceCard: {
      //   [Op.like]: `%${req.query.RaceCard || null}%`,
      // },
      // Competition: {
      //   [Op.like]: `%${req.query.Competition || null}%`,
      // },
      // Sponsor: {
      //   [Op.like]: `%${req.query.Sponsor || ""}%`,
      // },
      // StartTime: {
      //   [Op.between]: [
      //     req.query.racestartdate1 || "2021-12-01 00:00:00",
      //     req.query.racestartdate2 || "4030-12-01 00:00:00",
      //   ],
      // },
      // EndTime: {
      //   [Op.between]: [
      //     req.query.raceenddate1 || "2021-12-01 00:00:00",
      //     req.query.raceenddate2 || "4030-12-01 00:00:00",
      //   ],
      // },
      // Day: {
      //   [Op.between]: [
      //     req.query.racestartday || "2021-12-01 00:00:00",
      //     req.query.raceendday || "4030-12-01 00:00:00",
      //   ],
      // },

      createdAt: {
        [Op.between]: [
          req.query.startdate || "2021-12-01 00:00:00",
          req.query.endDate || "4030-12-01 00:00:00",
        ],
      },
    },
    limit,
    offset,
    paranoid: true,
  })
    .then((data) => {
      // console.log(page, limit, data);
      const response = getPagingData1(data, page, limit, counttotal);
      console.log(response);
      res.status(200).json({
        data: response.data,
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalcount: response.totalcount,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message || "Some error occurred while retrieving Color.",
      });
    });
});
exports.RestoreSoftDeletedRace = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findOne({
    paranoid: false,
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const restoredata = await RaceModel.restore({
    where: { _id: req.params.id },
  });
  res.status(200).json({
    success: true,
    restoredata,
  });
});

exports.GetHorsesofraces = Trackerror(async (req, res, next) => {
  let raceid = await RaceModel.findOne({
    where: {
      _id: req.params.id,
    },
  });
  if (raceid == null) {
    return next(new HandlerCallBack("Race not found", 404));
  }
  const data = await db.RaceModel.findAll({
    where: {
      _id: req.params.id,
    },
    include: [
      {
        model: db.HorseModel,
        as: "RaceCardRacesModelData",
        include: { all: true },
      },
    ],
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.GetRace = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findAll({
    where: { HorseFilled: true },
    include: [
      {
        paranoid: false,
        model: db.MeetingTypeModel,
        as: "MeetingTypeData",
      },

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
        include: {
          all: true,
        },
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
      {
        model: db.HorseAndRaceModel,
        as: "RacehorsesData",
        include: { all: true },
      },
    ],
  });

  res.status(200).json({
    success: true,
    data,
  });
});
exports.RaceWithTime = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findAll({
    order: [["StartTime", "ASC"]],
    // paranoid: false,
    include: [
      {
        model: db.RaceCourseModel,
        as: "RaceCourseData",
        // paranoid: false,
      },
      {
        model: db.TrackLengthModel,
        as: "TrackLengthData",
        // paranoid: false,
      },
      {
        model: db.RaceNameModel,
        as: "RaceNameModelData",
        // paranoid: false,
      },
    ],
    where: {
      HorseFilled: true,
    },
  });

  res.status(200).json({
    success: true,
    data,
  });
});
exports.GetRaceResultToBeAnnounced = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findAll({
    where: {
      // [Op.and]: [
      // {
      //   ResultStatus: "Awaited",
      // },
      RaceStatus: "Completed",
      // ],
    },
    include: [
      {
        model: db.MeetingTypeModel,
        as: "MeetingTypeData",
      },
      // {
      //   model: db.GroundTypeModel,
      //   as: "GroundData"
      // },
      {
        model: db.RaceCourseModel,
        as: "RaceCourseData",
      },
      {
        model: db.TrackLengthModel,
        as: "TrackLengthData",
      },
      {
        model: db.RaceNameModel,
        as: "RaceNameModelData",
      },
      {
        model: db.RaceKindModel,
        as: "RaceKindData",
      },
      {
        model: db.RaceTypeModel,
        as: "RaceTypeModelData",
      },
      {
        model: db.SponsorModel,
        as: "SponsorData",
      },
      {
        model: db.HorseModel,
        as: "RaceAndHorseModelData",
        include: { all: true },
      },
      {
        model: db.HorseAndRaceModel,
        as: "RacehorsesData",
        include: { all: true },
        // include: [
        //   {
        //     model: db.EquipmentModel,
        //     as: "EquipmentData1",
        //   },
        //   {
        //     model: db.HorseModel,
        //     as: "HorseModelIdData1",
        //   },
        //   {
        //     model: db.TrainerModel,
        //     as: "TrainerOnRaceData1",
        //   },
        //   {
        //     model: db.JockeyModel,
        //     as: "JockeyOnRaceData1",
        //   },
        //   {
        //     model: db.OwnerModel,
        //     as: "OwnerOnRaceData1",
        //   },
        // ],
      },
      {
        model: db.JockeyModel,
        include: { all: true },
      },
    ],
  });

  res.status(200).json({
    success: true,
    data,
  });
});
exports.CancelRace = Trackerror(async (req, res, next) => {
  const data = {
    RaceStatus: "Cancelled",
    ResultStatus: "Cancelled",
  };
  await RaceModel.update(
    { data },
    {
      where: {
        _id: req.params.id,
      },
    }
  );
  res.status(200).json({
    success: true,
    message: "Race has been cancelled",
  });
});
exports.GetRaceTobeOPublished = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findAll({
    where: { HorseFilled: false },
    include: { all: true },
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.RaceOrderByCountry = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findAll({
    where: { HorseFilled: true },
    // order: [["RaceCourse", "DESC"]],
    include: {
      model: RaceCourseModel,
      as: "RaceCourseData",
    },
    order: [["RaceCourseData", "Country", "DESC"]],
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.RaceOrderByRaceCourseOnly = Trackerror(async (req, res, next) => {
  const RaceCourseName = await RaceCourseModel.findAll({
    include: { all: true },
    attributes: ["Country"],
    group: "Country",
  });
  const data = await RaceModel.findAll({
    where: { HorseFilled: true },
    order: [["RaceStatus", "ASC"]],
    include: {
      model: RaceCourseModel,
      as: "RaceCourseData",
      // where: { TrackName: req.params.RaceCourseName },
      attributes: ["Country", "TrackName"],
    },
  });
  res.status(200).json({
    success: true,
    RaceCourseName,
    data,
  });
});
exports.PublishRaces = Trackerror(async (req, res, next) => {
  let data = await RaceModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("Race Is Not Available", 404));
  }
  data = await RaceModel.update(
    { HorseFilled: true },
    {
      where: {
        _id: req.params.id,
      },
    }
  );
  res.status(200).json({
    success: true,
    data,
  });
});
exports.AddRaceImage = Trackerror(async (req, res, next) => {
  if (!req.params.id) {
    return next(new HandlerCallBack("No Race id Available in param", 404));
  }
  const data = await RaceModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(
      new HandlerCallBack(
        "Race is not available or Result is not declared yet ",
        404
      )
    );
  }
  let file = [req.files.image];
  await file.map(async (singleimage) => {
    console.log(singleimage, "dsadsa");
    let SingleImage = generateFileName();
    console.log(singleimage);
    let SingleimagefileBuffer = await resizeImageBuffer(
      singleimage.data,
      214,
      212
    );
    await uploadFile(
      SingleimagefileBuffer,
      `${RaceImages}/${SingleImage}`,
      singleimage.mimetype
    );
    await RaceResultImagesModel.findOrCreate({
      where: {
        RaceId: data._id,
        image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${RaceImages}/${SingleImage}`,
      },
    });
  });
  res.status(201).json({
    success: true,
    message: "all images are been submitted",
  });
});
exports.GetRacesHorsesForResult = Trackerror(async (req, res, next) => {
  if (!req.params.raceid) {
    return next(new HandlerCallBack("No Race id Available in param", 404));
  }
  const data = await HorseAndRaceModel.findAll({
    where: {
      RaceModelId: req.params.raceid,
    },
    include: [
      {
        model: db.HorseModel,
        as: "HorseModelIdData1",
        attributes: ["_id"],
      },
    ],
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.Getracehorses = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findAll({
    where: {
      _id: req.params.id,
    },
    include: [
      {
        model: db.RaceAndHorseModel,
        as: "RaceAndHorseModelData",
        include: { all: true },
      },
      {
        model: db.HorseAndRaceModel,
        as: "RacehorsesData",
        include: { all: true },
      },
    ],
  });
  res.status(200).json({
    success: true,
    data: data,
  });
});

exports.ResultCreationV2 = Trackerror(async (req, res, next) => {
  const { ResultEntry } = req.body;
  if (!req.params.RaceId) {
    return next(new HandlerCallBack("No Race id provided in param", 404));
  }
  let RaceData = await RaceModel.findOne({
    where: { _id: req.params.RaceId },
  });
  first = 0;
  second = 0;
  third = 0;
  fourth = 0;
  fifth = 0;
  sixth = 0;
  for (let i = 0; i < ResultEntry; i++) {
    if (!ResultEntry[i].Rank) {
      return next(new HandlerCallBack("No Rank Exsist", 404));
    }
  }
  let sortedProducts = ResultEntry.sort((p1, p2) =>
    p1.Rank > p2.Rank ? 1 : p1.Rank < p2.Rank ? -1 : 0
  );

  for (let i = 0; i < sortedProducts.length; i++) {
    if (i > 0) {
      sortedProducts[i].BeatenBy = sortedProducts[i - 1].HorseID;

      if (sortedProducts[i].Rank == sortedProducts[i - 1].Rank) {
        sortedProducts[i].CumulativeDistance = Number(
          sortedProducts[i - 1].CumulativeDistance
        );
        sortedProducts[i].BeatenBy = sortedProducts[i - 1].BeatenBy;
      } else {
        sortedProducts[i].CumulativeDistance =
          Number(sortedProducts[i - 1].CumulativeDistance) +
          Number(sortedProducts[i].Distance);
      }
    }
    if (sortedProducts[i].Rank == 1) {
      first++;
    }
    if (sortedProducts[i].Rank == 2) {
      second++;
    }
    if (sortedProducts[i].Rank == 3) {
      third++;
    }
    if (sortedProducts[i].Rank == 4) {
      fourth++;
    }
    if (sortedProducts[i].Rank == 5) {
      fifth++;
    }
    if (sortedProducts[i].Rank == 6) {
      sixth++;
    }
    if (sortedProducts[i].Rank == 1) {
      sortedProducts[i].BeatenBy = null;
    }
  }
  for (let i = 0; i < sortedProducts.length; i++) {
    if (sortedProducts[i].Rank == 1) {
      if (RaceData.FirstPrice > 0) {
        sortedProducts[i].Prize = RaceData.FirstPrice / first;
      }
    }
    if (sortedProducts[i].Rank == 2) {
      if (RaceData.SecondPrice > 0) {
        sortedProducts[i].Prize = RaceData.SecondPrice / second;
      }
    }
    if (sortedProducts[i].Rank == 3) {
      if (RaceData.ThirdPrice > 0) {
        sortedProducts[i].Prize = RaceData.ThirdPrice / third;
      }
    }
    if (sortedProducts[i].Rank == 4) {
      if (RaceData.FourthPrice > 0) {
        sortedProducts[i].Prize = RaceData.FourthPrice / fourth;
      }
    }
    if (sortedProducts[i].Rank == 5) {
      if (RaceData.FifthPrice > 0) {
        sortedProducts[i].Prize = RaceData.FifthPrice / fifth;
      }
    }
    if (sortedProducts[i].Rank == 6) {
      if (RaceData.SixthPrice > 0) {
        sortedProducts[i].Prize = RaceData.SixthPrice / sixth;
      }
    }
  }
  let data;
  console.log("done");
  let a = [];

  for (let i = 0; i < ResultEntry.length; i++) {
    a.push({
      _id: ResultEntry[i].HorseID,
      STARS: ResultEntry[i].Rating,
    });
    console.log("done12");
    data = await ResultsModel.findOrCreate({
      where: {
        RaceID: req.params.RaceId,
        HorseID: ResultEntry[i].HorseID,
        Rating: ResultEntry[i].Rating,
        PrizeWin: ResultEntry[i].Prize,
        RaceTime: ResultEntry[i].RaceTime,
        VideoLink: ResultEntry[i].VideoLink,
        FinalPosition: ResultEntry[i].FinalPosition,
        Distance: ResultEntry[i].Distance,
        CumulativeDistance: ResultEntry[i].CumulativeDistance,
        BeatenBy: ResultEntry[i].BeatenBy,
        TrainerOnRace: ResultEntry[i].TrainerOnRace || null,
        JockeyOnRace: ResultEntry[i].JockeyOnRace || null,
      },
    });
  }
  const statements = [];
  const tableName = "HorseModel";

  for (let i = 0; i < ResultEntry.length; i++) {
    statements.push(
      db.sequelize.query(
        `UPDATE ${tableName} 
      SET STARS='${ResultEntry[i].Rating}' 
      WHERE _id='${ResultEntry[i].HorseID}';`
      )
    );
  }
  await Promise.all(statements);
  await RaceModel.update(
    { ResultStatus: "Announced" },
    {
      where: {
        _id: req.params.RaceId,
      },
    }
  );
  res.status(200).json({
    success: true,
    data,
  });
});

exports.ResultCreation = Trackerror(async (req, res, next) => {
  const { ResultEntry } = req.body;
  console.log(ResultEntry);
  console.log(req.params.RaceId);
  let ResultEntryData = Conversion(ResultEntry);
  await ResultEntryData.map(async (SingleResultEntry) => {
    await SingleResultEntry.map(async (SingleResultEntryDetail) => {
      SingleResultEntryDetail = SingleResultEntryDetail.split(",");
      await ResultsModel.findOrCreate({
        where: {
          RaceID: req.params.RaceId,
          HorseID: SingleResultEntryDetail[0],
          PointTableSystem: SingleResultEntryDetail[1],
          VideoLink: SingleResultEntryDetail[2],
          FinalPosition: SingleResultEntryDetail[3],
          Distance: SingleResultEntryDetail[4],
          CumulativeDistance: SingleResultEntryDetail[5],
          BeatenBy: SingleResultEntryDetail[6],
        },
      });
    });
  });
  const race = await RaceModel.update(
    { ResultStatus: "Announced" },
    {
      where: {
        _id: req.params.RaceId,
      },
    }
  );
  res.status(200).json({
    success: true,
    race,
  });
});
exports.VerdictLatest = Trackerror(async (req, res, next) => {
  const result = await RaceAndVerdictsHorseModel.findOne({
    order: [["RaceToBePredictData", "createdAt", "DESC"]],
    attributes: ["id"],
    include: [
      {
        model: db.RaceModel,
        as: "RaceToBePredictData",
        paranoid: false,
        attributes: ["_id", "RaceNumber"],
        include: [
          {
            model: db.HorseAndRaceModel,
            as: "RacehorsesData",
            attributes: [
              [
                sequelize.fn("COUNT", sequelize.col("HorseModelId")),
                "TotalRunners",
              ],
            ],
          },
          {
            model: db.RaceNameModel,
            as: "RaceNameModelData",
            attributes: ["_id", "NameEn", "NameAr"],
          },
          {
            model: db.RaceAndVerdictsHorseModel,
            as: "RaceToBePredictData",
            attributes: ["id", "Remarks"],

            include: [
              {
                model: db.VerdictModel,
                as: "VerdictNameData",
                attributes: ["NameEn", "NameAr", "_id"],
              },
              {
                model: db.HorseModel,
                as: "HorseNo1Data",
                attributes: ["NameEn", "NameAr", "_id"],
              },
              {
                model: db.HorseModel,
                as: "HorseNo2Data",
                attributes: ["NameEn", "NameAr", "_id"],
              },
              {
                model: db.HorseModel,
                as: "HorseNo3Data",
                attributes: ["NameEn", "NameAr", "_id"],
              },
            ],
          },
        ],
      },
    ],
  });
  console.log(result);
  // const data = await RaceModel.findOne({
  //   paranoid: false,
  //   where: {
  //     _id: result.RaceToBePredict,
  //   },
  //   include: [
  //     {
  //       model: db.MeetingTypeModel,
  //       as: "MeetingTypeData",
  //     },
  //     // {
  //     //   model: db.GroundTypeModel,
  //     //   as: "GroundData"
  //     // },
  //     {
  //       model: db.RaceCourseModel,
  //       as: "RaceCourseData",
  //     },
  //     {
  //       model: db.TrackLengthModel,
  //       as: "TrackLengthData",
  //     },
  //     {
  //       model: db.RaceNameModel,
  //       as: "RaceNameModelData",
  //     },
  //     {
  //       model: db.RaceKindModel,
  //       as: "RaceKindData",
  //     },
  //     {
  //       model: db.RaceTypeModel,
  //       as: "RaceTypeModelData",
  //     },
  //     {
  //       model: db.SponsorModel,
  //       as: "SponsorData",
  //     },
  //     {
  //       model: db.HorseModel,
  //       as: "RaceAndHorseModelData",
  //       include: { all: true },
  //     },
  //     {
  //       model: db.HorseAndRaceModel,
  //       as: "RacehorsesData",
  //       include: { all: true },
  //     },
  //     {
  //       model: db.CompetitonModel,
  //       as: "CompetitionRacesPointsModelData",
  //       include: { all: true },
  //     },
  //     {
  //       model: db.JockeyModel,
  //       include: [
  //         {
  //           model: db.NationalityModel,
  //           as: "JockeyNationalityData",
  //           paranoid: false,
  //         },
  //       ],
  //     },
  //   ],
  // });
  res.status(200).json({
    success: true,
    result,
  });
});
exports.AllResults = Trackerror(async (req, res, next) => {
  let length = await ResultModel.count();
  if (length == 0) {
    return next(new HandlerCallBack("No Race Result", 404));
  }

  const data = await RaceModel.findAll({
    include: [
      {
        // where: {
        //   RaceID: result.RaceID,
        // },

        model: db.ResultModel,
        as: "RaceResultData",
        include: { all: true },
        order: [["CumulativeDistance", "DESC"]],
      },
      {
        model: db.RaceNameModel,
        as: "RaceNameModelData",
      },
    ],
    attributes: ["_id"],
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.ResultLatest = Trackerror(async (req, res, next) => {
  let length = await ResultModel.count();
  if (length == 0) {
    return next(new HandlerCallBack("No Race Result", 404));
  }
  const result = await ResultModel.findOne({
    order: [["createdAt", "DESC"]],
  });
  // const data = await ResultModel.findAll({
  //   order: [["CumulativeDistance", "ASC"]],
  //   include: { all: true },
  //   where: {
  //     RaceID: result.RaceID,
  //   },
  // });
  const data = await RaceModel.findOne({
    include: [
      {
        order: [["CumulativeDistance", "DESC"]],
        where: {
          RaceID: result.RaceID,
        },

        model: db.ResultModel,
        as: "RaceResultData",
        include: { all: true },
      },
      {
        model: db.RaceNameModel,
        as: "RaceNameModelData",
      },
    ],
    attributes: ["_id"],
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.HorseHistory = Trackerror(async (req, res, next) => {
  const data = await ResultModel.findAll({
    where: {
      HorseID: req.params.horseid,
    },
    limit: 4,
    order: [["createdAt", "ASC"]],
    include: { all: true },
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.SingleRace = Trackerror(async (req, res, next) => {
  const { token } = req.cookies;
  let verify;
  let flag;
  let data;
  if (token) {
    console.log(token);
    let decodedData;
    try {
      decodedData = jwt.verify(token, process.env.JWT_SECRET);
      verify = await SubscriberModel.findOne({
        where: { _id: decodedData.id },
      });
      if (verify) {
        data = await RaceModel.findOne({
          where: { _id: req.params.id, HorseFilled: true },
          paranoid: false,
          attributes: {
            exclude: [
              "MeetingType",
              "RaceKind",
              "RaceName",
              "TrackLength",
              "HorseKindinRace",
              "Currency",
              "RaceCourse",
              "RaceType",
              "TrackCondition",
              "Sponsor",
              "createdAt",
              "updatedAt",
              "deletedAt",
              "Competition",
              "RaceCard",
              "BackupId",
            ],
            paranoid: false,
          },
          include: [
            {
              model: db.HorseKindModel,
              as: "HorseKindinRaceData",
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
              },
              paranoid: false,
            },
            {
              model: db.RaceCourseModel,
              as: "RaceCourseData",
              attributes: {
                exclude: [
                  "ColorCode",
                  "NationalityID",
                  "shortCode",
                  "AbbrevEn",
                  "AbbrevAr",
                  "createdAt",
                  "updatedAt",
                  "deletedAt",
                ],
              },
              paranoid: false,
            },
            {
              model: db.TrackLengthModel,
              as: "TrackLengthData",
              attributes: {
                exclude: ["GroundType", "createdAt", "updatedAt", "deletedAt"],
              },
              paranoid: false,
            },
            {
              model: db.RaceNameModel,
              as: "RaceNameModelData",
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
              },
              paranoid: false,
            },
            {
              model: db.TrackConditionModel,
              as: "TrackConditionData",
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
              },
              paranoid: false,
            },
            {
              model: db.CurrencyModel,
              as: "CurrencyData",
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
              },
              paranoid: false,
            },
            {
              model: db.RaceKindModel,
              as: "RaceKindData",
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
              },
              paranoid: false,
            },
            {
              model: db.RaceTypeModel,
              as: "RaceTypeModelData",
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
              },
              paranoid: false,
            },
            {
              model: db.SponsorModel,
              as: "SponsorData",
              attributes: {
                exclude: [
                  "createdAt",
                  "updatedAt",
                  "deletedAt",
                  "DescriptionEn",
                  "DescriptionAr",
                ],
              },
              paranoid: false,
            },
            {
              model: db.CompetitonModel,
              as: "CompetitionRacesPointsModelData",
              include: { all: true },
              paranoid: false,
            },
            {
              model: db.ResultModel,
              as: "RaceResultData",
              include: { all: true },
              paranoid: false,
            },
            {
              model: db.HorseAndRaceModel,
              as: "RacehorsesData",
              attributes: {
                exclude: [
                  "RaceModelId",
                  "HorseModelId",
                  "Equipment",
                  "TrainerOnRace",
                  "JockeyOnRace",
                  "OwnerOnRace",
                ],
              },

              include: [
                {
                  model: db.EquipmentModel,
                  as: "EquipmentData1",
                  attributes: {
                    exclude: [
                      "createdAt",
                      "updatedAt",
                      "deletedAt",
                      "BackupId",
                    ],
                  },
                },
                {
                  model: db.HorseModel,
                  as: "HorseModelIdData1",
                  attributes: ["NameEn", "NameAr", "_id", "DOB", "HorseImage"],
                  include: [
                    {
                      model: db.HorseModel,
                      as: "DamData",
                      attributes: {
                        exclude: ["createdAt", "updatedAt", "deletedAt"],
                      },
                    },
                    {
                      model: db.test,
                      as: "TrackHorses",
                      attributes: {
                        exclude: ["createdAt", "updatedAt", "deletedAt"],
                      },
                    },
                    {
                      model: db.NationalityModel,
                      as: "NationalityData",
                      attributes: {
                        exclude: ["createdAt", "updatedAt", "deletedAt"],
                      },
                    },
                    {
                      model: db.BreederModel,
                      as: "BreederData",
                      attributes: {
                        exclude: ["createdAt", "updatedAt", "deletedAt"],
                      },
                    },
                    {
                      model: db.HorseModel,
                      as: "SireData",
                      attributes: {
                        exclude: ["createdAt", "updatedAt", "deletedAt"],
                      },
                    },
                    {
                      model: db.HorseModel,
                      as: "GSireData",
                      attributes: {
                        exclude: ["createdAt", "updatedAt", "deletedAt"],
                      },
                    },
                  ],
                },
                {
                  model: db.TrainerModel,
                  as: "TrainerOnRaceData1",
                  attributes: ["NameEn", "NameAr", "_id", "BackupId", "image"],
                },
                {
                  model: db.JockeyModel,
                  as: "JockeyOnRaceData1",
                  attributes: {
                    exclude: [
                      "createdAt",
                      "updatedAt",
                      "deletedAt",
                      "shortCode",
                      "JockeyLicenseDate",
                      "RemarksEn",
                      "Rating",
                      "NationalityID",
                      "BackupId",
                    ],
                  },
                },
                {
                  model: db.OwnerModel,
                  as: "OwnerOnRaceData1",
                  attributes: {
                    exclude: [
                      "createdAt",
                      "updatedAt",
                      "deletedAt",
                      "BackupId",
                    ],
                  },
                },
                {
                  model: db.ColorModel,
                  as: "CapColorData1",
                  attributes: {
                    exclude: [
                      "createdAt",
                      "updatedAt",
                      "deletedAt",
                      "BackupId",
                    ],
                  },
                },
              ],
              paranoid: false,
            },
          ],
          order: [["RacehorsesData", "HorseNo", "ASC"]],
        });
      } else {
        data = await RaceModel.findOne({
          where: { _id: req.params.id, HorseFilled: true },
          paranoid: false,
          attributes: {
            exclude: [
              "MeetingType",
              "RaceKind",
              "RaceName",
              "TrackLength",
              "HorseKindinRace",
              "Currency",
              "RaceCourse",
              "RaceType",
              "TrackCondition",
              "Sponsor",
              "createdAt",
              "updatedAt",
              "deletedAt",
              "Competition",
              "RaceCard",
              "BackupId",
            ],
            paranoid: false,
          },
          include: [
            {
              model: db.HorseKindModel,
              as: "HorseKindinRaceData",
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
              },
              paranoid: false,
            },
            {
              model: db.RaceCourseModel,
              as: "RaceCourseData",
              attributes: {
                exclude: [
                  "ColorCode",
                  "NationalityID",
                  "shortCode",
                  "AbbrevEn",
                  "AbbrevAr",
                  "createdAt",
                  "updatedAt",
                  "deletedAt",
                ],
              },
              paranoid: false,
            },
            {
              model: db.TrackLengthModel,
              as: "TrackLengthData",
              attributes: {
                exclude: ["GroundType", "createdAt", "updatedAt", "deletedAt"],
              },
              paranoid: false,
            },
            {
              model: db.RaceNameModel,
              as: "RaceNameModelData",
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
              },
              paranoid: false,
            },
            {
              model: db.TrackConditionModel,
              as: "TrackConditionData",
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
              },
              paranoid: false,
            },
            {
              model: db.CurrencyModel,
              as: "CurrencyData",
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
              },
              paranoid: false,
            },
            {
              model: db.RaceKindModel,
              as: "RaceKindData",
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
              },
              paranoid: false,
            },
            {
              model: db.RaceTypeModel,
              as: "RaceTypeModelData",
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
              },
              paranoid: false,
            },
            {
              model: db.SponsorModel,
              as: "SponsorData",
              attributes: {
                exclude: [
                  "createdAt",
                  "updatedAt",
                  "deletedAt",
                  "DescriptionEn",
                  "DescriptionAr",
                ],
              },
              paranoid: false,
            },
            {
              model: db.CompetitonModel,
              as: "CompetitionRacesPointsModelData",
              include: { all: true },
              paranoid: false,
            },
            {
              model: db.ResultModel,
              as: "RaceResultData",
              include: { all: true },
              paranoid: false,
            },
            {
              model: db.HorseAndRaceModel,
              as: "RacehorsesData",
              attributes: {
                exclude: [
                  "RaceModelId",
                  "HorseModelId",
                  "Equipment",
                  "TrainerOnRace",
                  "JockeyOnRace",
                  "OwnerOnRace",
                ],
              },

              include: [
                {
                  model: db.EquipmentModel,
                  as: "EquipmentData1",
                  attributes: {
                    exclude: [
                      "createdAt",
                      "updatedAt",
                      "deletedAt",
                      "BackupId",
                    ],
                  },
                },
                {
                  model: db.HorseModel,
                  as: "HorseModelIdData1",
                  attributes: ["NameEn", "NameAr", "_id", "DOB", "HorseImage"],
                  include: [
                    {
                      model: db.HorseModel,
                      as: "DamData",
                      attributes: {
                        exclude: ["createdAt", "updatedAt", "deletedAt"],
                      },
                    },
                    {
                      model: db.NationalityModel,
                      as: "NationalityData",
                      attributes: {
                        exclude: ["createdAt", "updatedAt", "deletedAt"],
                      },
                    },

                    {
                      model: db.BreederModel,
                      as: "BreederData",
                      attributes: {
                        exclude: ["createdAt", "updatedAt", "deletedAt"],
                      },
                    },
                    {
                      model: db.HorseModel,
                      as: "SireData",
                      attributes: {
                        exclude: ["createdAt", "updatedAt", "deletedAt"],
                      },
                    },
                    {
                      model: db.HorseModel,
                      as: "GSireData",
                      attributes: {
                        exclude: ["createdAt", "updatedAt", "deletedAt"],
                      },
                    },
                  ],
                },
                {
                  model: db.TrainerModel,
                  as: "TrainerOnRaceData1",
                  attributes: ["NameEn", "NameAr", "_id", "BackupId", "image"],
                },
                {
                  model: db.JockeyModel,
                  as: "JockeyOnRaceData1",
                  attributes: {
                    exclude: [
                      "createdAt",
                      "updatedAt",
                      "deletedAt",
                      "shortCode",
                      "JockeyLicenseDate",
                      "RemarksEn",
                      "Rating",
                      "NationalityID",
                      "BackupId",
                    ],
                  },
                },
                {
                  model: db.OwnerModel,
                  as: "OwnerOnRaceData1",
                  attributes: {
                    exclude: [
                      "createdAt",
                      "updatedAt",
                      "deletedAt",
                      "BackupId",
                    ],
                  },
                },
                {
                  model: db.ColorModel,
                  as: "CapColorData1",
                  attributes: {
                    exclude: [
                      "createdAt",
                      "updatedAt",
                      "deletedAt",
                      "BackupId",
                    ],
                  },
                },
              ],
              paranoid: false,
            },
          ],
        });
      }
    } catch (err) {
      data = await RaceModel.findOne({
        where: { _id: req.params.id, HorseFilled: true },
        paranoid: false,
        attributes: {
          exclude: [
            "MeetingType",
            "RaceKind",
            "RaceName",
            "TrackLength",
            "HorseKindinRace",
            "Currency",
            "RaceCourse",
            "RaceType",
            "TrackCondition",
            "Sponsor",
            "createdAt",
            "updatedAt",
            "deletedAt",
            "Competition",
            "RaceCard",
            "BackupId",
          ],
          paranoid: false,
        },
        include: [
          {
            model: db.HorseKindModel,
            as: "HorseKindinRaceData",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
            paranoid: false,
          },
          {
            model: db.RaceCourseModel,
            as: "RaceCourseData",
            attributes: {
              exclude: [
                "ColorCode",
                "NationalityID",
                "shortCode",
                "AbbrevEn",
                "AbbrevAr",
                "createdAt",
                "updatedAt",
                "deletedAt",
              ],
            },
            paranoid: false,
          },
          {
            model: db.TrackLengthModel,
            as: "TrackLengthData",
            attributes: {
              exclude: ["GroundType", "createdAt", "updatedAt", "deletedAt"],
            },
            paranoid: false,
          },
          {
            model: db.RaceNameModel,
            as: "RaceNameModelData",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
            paranoid: false,
          },
          {
            model: db.TrackConditionModel,
            as: "TrackConditionData",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
            paranoid: false,
          },
          {
            model: db.CurrencyModel,
            as: "CurrencyData",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
            paranoid: false,
          },
          {
            model: db.RaceKindModel,
            as: "RaceKindData",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
            paranoid: false,
          },
          {
            model: db.RaceTypeModel,
            as: "RaceTypeModelData",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
            paranoid: false,
          },
          {
            model: db.SponsorModel,
            as: "SponsorData",
            attributes: {
              exclude: [
                "createdAt",
                "updatedAt",
                "deletedAt",
                "DescriptionEn",
                "DescriptionAr",
              ],
            },
            paranoid: false,
          },
          {
            model: db.CompetitonModel,
            as: "CompetitionRacesPointsModelData",
            include: { all: true },
            paranoid: false,
          },
          {
            model: db.ResultModel,
            as: "RaceResultData",
            include: { all: true },
            paranoid: false,
          },
          {
            model: db.HorseAndRaceModel,
            as: "RacehorsesData",
            attributes: {
              exclude: [
                "RaceModelId",
                "HorseModelId",
                "Equipment",
                "TrainerOnRace",
                "JockeyOnRace",
                "OwnerOnRace",
              ],
            },

            include: [
              {
                model: db.EquipmentModel,
                as: "EquipmentData1",
                attributes: {
                  exclude: ["createdAt", "updatedAt", "deletedAt", "BackupId"],
                },
              },
              {
                model: db.HorseModel,
                as: "HorseModelIdData1",
                attributes: ["NameEn", "NameAr", "_id", "DOB", "HorseImage"],
                include: [
                  {
                    model: db.HorseModel,
                    as: "DamData",
                    attributes: {
                      exclude: ["createdAt", "updatedAt", "deletedAt"],
                    },
                  },
                  {
                    model: db.NationalityModel,
                    as: "NationalityData",
                    attributes: {
                      exclude: ["createdAt", "updatedAt", "deletedAt"],
                    },
                  },

                  {
                    model: db.BreederModel,
                    as: "BreederData",
                    attributes: {
                      exclude: ["createdAt", "updatedAt", "deletedAt"],
                    },
                  },
                  {
                    model: db.HorseModel,
                    as: "SireData",
                    attributes: {
                      exclude: ["createdAt", "updatedAt", "deletedAt"],
                    },
                  },
                  {
                    model: db.HorseModel,
                    as: "GSireData",
                    attributes: {
                      exclude: ["createdAt", "updatedAt", "deletedAt"],
                    },
                  },
                ],
              },
              {
                model: db.TrainerModel,
                as: "TrainerOnRaceData1",
                attributes: ["NameEn", "NameAr", "_id", "BackupId", "image"],
              },
              {
                model: db.JockeyModel,
                as: "JockeyOnRaceData1",
                attributes: {
                  exclude: [
                    "createdAt",
                    "updatedAt",
                    "deletedAt",
                    "shortCode",
                    "JockeyLicenseDate",
                    "RemarksEn",
                    "Rating",
                    "NationalityID",
                    "BackupId",
                  ],
                },
              },
              {
                model: db.OwnerModel,
                as: "OwnerOnRaceData1",
                attributes: {
                  exclude: ["createdAt", "updatedAt", "deletedAt", "BackupId"],
                },
              },
              {
                model: db.ColorModel,
                as: "CapColorData1",
                attributes: {
                  exclude: ["createdAt", "updatedAt", "deletedAt", "BackupId"],
                },
              },
            ],
            paranoid: false,
          },
        ],
      });
    }
  } else {
    console.log("hello");
    data = await RaceModel.findOne({
      where: { _id: req.params.id, HorseFilled: true },
      paranoid: false,
      attributes: {
        exclude: [
          "MeetingType",
          "RaceKind",
          "RaceName",
          "TrackLength",
          "HorseKindinRace",
          "Currency",
          "RaceCourse",
          "RaceType",
          "TrackCondition",
          "Sponsor",
          "createdAt",
          "updatedAt",
          "deletedAt",
          "Competition",
          "RaceCard",
          "BackupId",
        ],
        paranoid: false,
      },
      include: [
        {
          model: db.HorseKindModel,
          as: "HorseKindinRaceData",
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
          paranoid: false,
        },
        {
          model: db.RaceCourseModel,
          as: "RaceCourseData",
          attributes: {
            exclude: [
              "ColorCode",
              "NationalityID",
              "shortCode",
              "AbbrevEn",
              "AbbrevAr",
              "createdAt",
              "updatedAt",
              "deletedAt",
            ],
          },
          paranoid: false,
        },
        {
          model: db.TrackLengthModel,
          as: "TrackLengthData",
          attributes: {
            exclude: ["GroundType", "createdAt", "updatedAt", "deletedAt"],
          },
          paranoid: false,
        },
        {
          model: db.RaceNameModel,
          as: "RaceNameModelData",
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
          paranoid: false,
        },
        {
          model: db.TrackConditionModel,
          as: "TrackConditionData",
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
          paranoid: false,
        },
        {
          model: db.CurrencyModel,
          as: "CurrencyData",
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
          paranoid: false,
        },
        {
          model: db.RaceKindModel,
          as: "RaceKindData",
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
          paranoid: false,
        },
        {
          model: db.RaceTypeModel,
          as: "RaceTypeModelData",
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
          paranoid: false,
        },
        {
          model: db.SponsorModel,
          as: "SponsorData",
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "deletedAt",
              "DescriptionEn",
              "DescriptionAr",
            ],
          },
          paranoid: false,
        },
        {
          model: db.CompetitonModel,
          as: "CompetitionRacesPointsModelData",
          include: { all: true },
          paranoid: false,
        },
        {
          model: db.ResultModel,
          as: "RaceResultData",
          include: { all: true },
          paranoid: false,
        },
        {
          model: db.HorseAndRaceModel,
          as: "RacehorsesData",
          attributes: {
            exclude: [
              "RaceModelId",
              "HorseModelId",
              "Equipment",
              "TrainerOnRace",
              "JockeyOnRace",
              "OwnerOnRace",
            ],
          },

          include: [
            {
              model: db.EquipmentModel,
              as: "EquipmentData1",
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt", "BackupId"],
              },
            },
            {
              model: db.HorseModel,
              as: "HorseModelIdData1",
              attributes: ["NameEn", "NameAr", "_id", "DOB", "HorseImage"],
              include: [
                {
                  model: db.HorseModel,
                  as: "DamData",
                  attributes: {
                    exclude: ["createdAt", "updatedAt", "deletedAt"],
                  },
                },
                {
                  model: db.NationalityModel,
                  as: "NationalityData",
                  attributes: {
                    exclude: ["createdAt", "updatedAt", "deletedAt"],
                  },
                },

                {
                  model: db.BreederModel,
                  as: "BreederData",
                  attributes: {
                    exclude: ["createdAt", "updatedAt", "deletedAt"],
                  },
                },
                {
                  model: db.HorseModel,
                  as: "SireData",
                  attributes: {
                    exclude: ["createdAt", "updatedAt", "deletedAt"],
                  },
                },
                {
                  model: db.HorseModel,
                  as: "GSireData",
                  attributes: {
                    exclude: ["createdAt", "updatedAt", "deletedAt"],
                  },
                },
              ],
            },
            {
              model: db.TrainerModel,
              as: "TrainerOnRaceData1",
              attributes: ["NameEn", "NameAr", "_id", "BackupId", "image"],
            },
            {
              model: db.JockeyModel,
              as: "JockeyOnRaceData1",
              attributes: {
                exclude: [
                  "createdAt",
                  "updatedAt",
                  "deletedAt",
                  "shortCode",
                  "JockeyLicenseDate",
                  "RemarksEn",
                  "Rating",
                  "NationalityID",
                  "BackupId",
                ],
              },
            },
            {
              model: db.OwnerModel,
              as: "OwnerOnRaceData1",
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt", "BackupId"],
              },
            },
            {
              model: db.ColorModel,
              as: "CapColorData1",
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt", "BackupId"],
              },
            },
          ],
          paranoid: false,
        },
      ],
      order: [["RacehorsesData", "HorseNo", "ASC"]],
    });
  }

  // if (!data) {
  //   return next(new HandlerCallBack("Race is Not Available", 404));
  // } else {
  res.status(200).json({
    success: true,
    data,
  });
  // }
});
exports.CreateRace = Trackerror(async (req, res, next) => {
  const {
    RaceKind,
    DescriptionEn,
    RaceCourse,
    RaceType,
    RaceStatus,
    StartTime,
    DescriptionAr,
    RaceName,
    RaceNameAr,
    WeatherType,
    WeatherDegree,
    WeatherIcon,
    HorseKindinRace,
    TrackLength,
    MeetingType,
    MeetingCode,
    Ground,
    Sponsor,
    EndTime,
    Day,

    RaceNumber,
    totalPrize,
    PrizeNumber,
    RaceWeight,
  } = req.body;
  let = {
    FirstPrice,
    SecondPrice,
    ThirdPrice,
    FourthPrice,
    FifthPrice,
    SixthPrice,
    Currency,
    TrackCondition,
  } = req.body;

  if (!totalPrize) {
    return next(new HandlerCallBack("Please provide total prize", 404));
  }
  if (PrizeNumber == 6) {
    let first = 60 / 100;

    let second = 20 / 100;

    let third = 10 / 100;

    let fouth = 5 / 100;
    let fifth = 3 / 100;

    let six = 2 / 100;
    SecondPrice = second * totalPrize;
    ThirdPrice = third * totalPrize;
    FourthPrice = fouth * totalPrize;
    FifthPrice = fifth * totalPrize;
    FirstPrice = first * totalPrize;
    SixthPrice = six * totalPrize;
  } else {
    let first = 60 / 100;
    console.log(first * totalPrize, "first");
    let second = 20 / 100;
    console.log(second * totalPrize, "second");

    let third = 11 / 100;
    console.log(third * totalPrize, "third");

    let fouth = 6 / 100;
    console.log(fouth * totalPrize, "fouth");

    let fifth = 3 / 100;
    console.log(fifth * totalPrize, "fifth");

    let six = 0 / 100;
    SecondPrice = second * totalPrize;
    ThirdPrice = third * totalPrize;
    FourthPrice = fouth * totalPrize;
    FifthPrice = fifth * totalPrize;
    FirstPrice = first * totalPrize;
    SixthPrice = six * totalPrize;
  }
  let TrackConditionChecking;
  if (!TrackConditionChecking) {
    TrackConditionChecking = await db.TrackConditionModel.findOne({
      where: {
        NameEn: "GS",
      },
      attributes: ["_id"],
    });
  }
  console.log(TrackConditionChecking._id);
  let CurrencyChecking;
  if (!CurrencyChecking) {
    CurrencyChecking = await db.CurrencyModel.findOne({
      where: {
        NameEn: "AED",
      },
      attributes: ["_id"],
    });
  }
  console.log(CurrencyChecking._id, "ddad");
  console.log(Currency || CurrencyChecking._id, "ddad");

  // return condition1 ? value1
  //   : condition2 ? value2
  //     : condition3 ? value3
  //       : value4;

  const data = await RaceModel.create({
    // image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Race}/${Image}`,
    RaceKind: RaceKind,
    DescriptionEn: DescriptionEn,
    DescriptionAr: DescriptionAr,
    RaceCourse: RaceCourse,
    RaceStatus: RaceStatus,
    StartTime: StartTime,
    RaceNumber: RaceNumber,
    // EndTime: EndTime,
    RaceType: RaceType,
    HorseKindinRace: HorseKindinRace,
    WeatherType: WeatherType,
    WeatherDegree: WeatherDegree,
    WeatherIcon: WeatherIcon,
    RaceName: RaceName,
    TrackLength: TrackLength,
    FirstPrice: FirstPrice,
    SecondPrice: SecondPrice,
    ThirdPrice: ThirdPrice,
    FourthPrice: FourthPrice,
    FifthPrice: FifthPrice,
    SixthPrice: SixthPrice,
    MeetingType: MeetingType,
    MeetingCode: MeetingCode,
    TrackLength: TrackLength,
    Ground: Ground,
    Sponsor: Sponsor,
    Day: Day,
    TrackCondition: !TrackCondition
      ? TrackCondition
      : TrackConditionChecking._id,
    RaceWeight: RaceWeight,
    Currency: !Currency ? Currency : CurrencyChecking._id,
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.AddPointTable = Trackerror(async (req, res, next) => {
  let RaceId = await RaceModel.findOne({
    where: { _id: req.params.id },
  });
  if (!RaceId) {
    return next(new HandlerCallBack("Race Card not found", 404));
  } else {
    let { Points } = req.body;

    await Points.map(async (singlepoint) => {
      await RaceAndPointsSystemModel.create({
        Race: req.params.id,
        Point: singlepoint,
      });
    });
    await RaceModel.update(
      { role: "approveduser" },
      {
        where: {
          _id: req.params.id,
        },
      }
    );
    res.status(200).json({
      success: true,
    });
  }
});
exports.IncludeHorses = Trackerror(async (req, res, next) => {
  const { HorseEntry } = req.body;
  console.log(req.body);
  let HorseEntryData = Conversion(HorseEntry);
  console.log(HorseEntry, "dsad");
  let horsedata;
  for (let i = 0; i < HorseEntry.length; i++) {
    horsedata = await HorseModel.findOne({
      where: {
        _id: HorseEntry[i].HorseModelId,
      },
    });
    await HorseAndRaceModel.findOrCreate({
      where: {
        GateNo: HorseEntry[i].GateNo,
        HorseNo: HorseEntry[i].HorseNo,
        RaceModelId: req.params.id,
        HorseModelId: HorseEntry[i].HorseModelId,
        Equipment: HorseEntry[i].Equipment || null,
        TrainerOnRace: horsedata.ActiveTrainer,
        OwnerOnRace: horsedata.ActiveOwner,
        JockeyOnRace: HorseEntry[i].JockeyOnRace || null,
        JockeyWeight: HorseEntry[i].JockeyWeight || null,
        Rating: HorseEntry[i].Rating,
        HorseRunningStatus: HorseEntry[i].HorseRunningStatus,
        CapColor: HorseEntry[i].CapColor,
        JockeyRaceWeight: HorseEntry[i].JockeyRaceWeight || null,
      },
    });
  }
  // await HorseEntryData.map(async (singlehorse) => {
  //   await singlehorse.map(async (singlehorsedetail) => {
  //     singlehorsedetail = singlehorsedetail.split(",");
  // horsedata = await HorseModel.findOne({
  //   where: {
  //     _id: singlehorsedetail[2],
  //   },
  // });
  // console.log(horsedata);
  //     try {
  //       await HorseAndRaceModel.findOrCreate({
  //         where: {
  //           GateNo: singlehorsedetail[0],
  //           HorseNo: singlehorsedetail[1],
  //           RaceModelId: req.params.id,
  //           HorseModelId: singlehorsedetail[2],
  //           Equipment: singlehorsedetail[3],
  //           TrainerOnRace: horsedata.ActiveTrainer,
  //           OwnerOnRace: horsedata.ActiveOwner,
  //           JockeyOnRace: null,
  //           JockeyWeight: singlehorsedetail[5] || null,
  //           Rating: singlehorsedetail[6],
  //           HorseRunningStatus: singlehorsedetail[7],
  //           CapColor: singlehorsedetail[8],
  //           JockeyRaceWeight: singlehorsedetail[9] || null,
  //         },
  //       });
  //     } catch (err) {
  //       console.log(err);
  //       // res.send({
  //       //   message: err
  //       // });
  //       // res.end();
  //       // return;
  //     }

  //     horsedata = null;
  //   });
  // });
  res.status(200).json({
    success: true,
  });
});

exports.IncludeVerdicts = Trackerror(async (req, res, next) => {
  const { VerdictEntry } = req.body;
  console.log(req.body);
  console.log(VerdictEntry, "VerdictEntry");
  let VerdictEntryData = Conversion(VerdictEntry);
  console.log(VerdictEntryData, "dsad");
  await VerdictEntryData.map(async (singleverdict) => {
    await singleverdict.map(async (singleverdictdetail) => {
      singleverdictdetail = singleverdictdetail.split(",");
      console.log(singleverdictdetail[0], "1");
      console.log(singleverdictdetail[1], "2");
      console.log(singleverdictdetail[2], "3");
      console.log(singleverdictdetail[3], "4");
      console.log(singleverdictdetail[4], "5");
      await RaceAndVerdictsHorseModel.create({
        VerdictName: singleverdictdetail[0],
        RaceToBePredict: req.params.id,
        HorseNo1: singleverdictdetail[1],
        HorseNo2: singleverdictdetail[2],
        HorseNo3: singleverdictdetail[3],
        Remarks: singleverdictdetail[4],
      });
    });
  });
  res.status(200).json({
    success: true,
  });
});
exports.GetRaceWithStartTime = Trackerror(async (req, res, next) => {
  const { StartTime } = req.body;
  console.log(StartTime);
  console.log(req.body);
  const [results, metadata] = await db.sequelize.query(`SELECT
  *
FROM
  mksracing.RaceModel
WHERE
  StartTime >= '${StartTime}'
  AND StartTime < ('${StartTime}' + INTERVAL 1 DAY) AND deletedAt = null;`);
  let arrayof_ids = [];
  results.map((singleresult) => arrayof_ids.push(singleresult._id));
  const data = await RaceModel.findAll({
    where: {
      _id: arrayof_ids,
    },
    include: [
      {
        model: db.MeetingTypeModel,
        as: "MeetingTypeData",
      },
      // {
      //   model: db.GroundTypeModel,
      //   as: "GroundData"
      // },
      {
        model: db.RaceCourseModel,
        as: "RaceCourseData",
      },
      {
        model: db.TrackLengthModel,
        as: "TrackLengthData",
      },
      {
        model: db.RaceNameModel,
        as: "RaceNameModelData",
      },
      {
        model: db.RaceKindModel,
        as: "RaceKindData",
      },
      {
        model: db.RaceTypeModel,
        as: "RaceTypeModelData",
      },
      {
        model: db.SponsorModel,
        as: "SponsorData",
      },

      {
        model: db.HorseAndRaceModel,
        include: { all: true },
      },
      {
        model: db.JockeyModel,
        include: [{ model: db.NationalityModel, as: "JockeyNationalityData" }],
      },
    ],
  });
  console.log(data.length);
  res.status(200).json({
    success: true,
    data,
  });
});
exports.EditRace = Trackerror(async (req, res, next) => {
  const {
    RaceKind,
    DescriptionEn,
    RaceCourse,
    RaceType,
    RaceStatus,
    StartTime,
    DescriptionAr,
    RaceName,
    RaceNameAr,
    WeatherType,
    WeatherDegree,
    WeatherIcon,
    TrackLength,
    FirstPrice,
    SecondPrice,
    ThirdPrice,
    FourthPrice,
    FifthPrice,
    SixthPrice,
    MeetingType,
    MeetingCode,
    Ground,
    Sponsor,
    EndTime,
    Day,
    TrackCondition,
    HorseKindinRace,
    Currency,
    RaceWeight,
  } = req.body;
  let data = await RaceModel.findOne({
    where: { _id: req.params.id },
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  if (req.files == null) {
    const updateddata = {
      RaceKind: RaceKind || data.RaceKind,
      RaceName: RaceName || data.RaceName,
      DescriptionEn: DescriptionEn || data.DescriptionEn,
      RaceCourse: RaceCourse || data.RaceCourse,
      RaceType: RaceType || data.RaceType,
      RaceStatus: RaceStatus || data.RaceStatus,
      StartTime: StartTime || data.StartTime,
      EndTime: EndTime || data.EndTime,
      DescriptionAr: DescriptionAr || data.DescriptionAr,
      RaceNameAr: RaceNameAr || data.RaceNameAr,
      WeatherType: WeatherType || data.WeatherType,
      WeatherDegree: WeatherDegree || data.WeatherDegree,
      WeatherIcon: WeatherIcon || data.WeatherIcon,
      TrackLength: TrackLength || data.TrackLength,
      FirstPrice: FirstPrice || data.FirstPrice,
      SecondPrice: SecondPrice || data.SecondPrice,
      ThirdPrice: ThirdPrice || data.ThirdPrice,
      FourthPrice: FourthPrice || data.FourthPrice,
      FifthPrice: FifthPrice || data.FifthPrice,
      SixthPrice: SixthPrice || data.SixthPrice,
      MeetingType: MeetingType || data.MeetingType,
      MeetingCode: MeetingCode || data.MeetingCode,
      Ground: Ground || data.Ground,
      Sponsor: Sponsor || data.Sponsor,
      Day: Day || data.Day,
      TrackCondition: TrackCondition || data.TrackCondition,
      HorseKindinRace: HorseKindinRace || data.HorseKindinRace,
      Currency: Currency || data.Currency,
      RaceWeight: RaceWeight || data.RaceWeight,
    };
    data = await RaceModel.update(updateddata, {
      where: {
        _id: req.params.id,
      },
    });
    res.status(200).json({
      success: true,
      data,
    });
  } else {
    const file = req.files.image;
    await deleteFile(`${Race}/${data.image}`);
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${Race}/${Image}`, file.mimetype);
    const updateddata = {
      image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Race}/${Image}`,
      RaceKind: RaceKind || data.RaceKind,
      RaceName: RaceName || data.RaceName,
      DescriptionEn: DescriptionEn || data.DescriptionEn,
      RaceCourse: RaceCourse || data.RaceCourse,
      RaceType: RaceType || data.RaceType,
      RaceStatus: RaceStatus || data.RaceStatus,
      StartTime: StartTime || data.StartTime,
      EndTime: EndTime || data.EndTime,
      DescriptionAr: DescriptionAr || data.DescriptionAr,
      RaceNameAr: RaceNameAr || data.RaceNameAr,
      WeatherType: WeatherType || data.WeatherType,
      WeatherDegree: WeatherDegree || data.WeatherDegree,
      WeatherIcon: WeatherIcon || data.WeatherIcon,
      TrackLength: TrackLength || data.TrackLength,
      FirstPrice: FirstPrice || data.FirstPrice,
      SecondPrice: SecondPrice || data.SecondPrice,
      ThirdPrice: ThirdPrice || data.ThirdPrice,
      FourthPrice: FourthPrice || data.FourthPrice,
      FifthPrice: FifthPrice || data.FifthPrice,
      SixthPrice: SixthPrice || data.SixthPrice,
      MeetingType: MeetingType || data.MeetingType,
      MeetingCode: MeetingCode || data.MeetingCode,
      Ground: Ground || data.Ground,
      Sponsor: Sponsor || data.Sponsor,
      Day: Day || data.Day,
      TrackCondition: TrackCondition || data.TrackCondition,
      HorseKindinRace: HorseKindinRace || data.HorseKindinRace,
      Currency: Currency || data.Currency,
      RaceWeight: RaceWeight || data.RaceWeight,
    };
    data = await RaceModel.update(updateddata, {
      where: {
        _id: req.params.id,
      },
    });
    res.status(200).json({
      success: true,
      data,
    });
  }
});
exports.DeleteRace = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findOne({
    where: { _id: req.params.id },
    include: { all: true },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);
  await RaceModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteRace = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);
  await RaceModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.GetRaceonTimeAndRaceCourse = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findAll({
    where: {
      [Op.and]: [
        { RaceCourse: req.params.RaceCourseid },
        { StartTime: req.params.StartTime },
      ],
    },
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.RacePredictor = Trackerror(async (req, res, next) => {
  const AllHorses = await HorseAndRaceModel.findAll({
    where: { RaceModelId: req.params.id },
    attributes: ["HorseModelId", "GateNo", "HorseNo", "HorseRunningStatus"],
    include: [
      {
        model: db.HorseModel,
        as: "HorseModelIdData1",
        attributes: ["NameEn", "NameAr"],
        include: [
          {
            model: db.SubscriberAndCompetitionModel,
            as: "CompetitionHorseIDData",
            attributes: [
              [
                sequelize.literal(
                  "(SELECT COUNT(*) FROM SubscriberAndCompetitionModel where SubscriberAndCompetitionModel.HorseID=HorseModelIdData1._id)"
                ),
                "HorseScore",
              ],
            ],
          },
        ],
      },
    ],
  });
  const data = await SubscriberAndCompetitionModel.findAll({
    where: { RaceID: req.params.id },
    // include: { all: true },
    attributes: [
      [sequelize.fn("count", sequelize.col("RaceID")), "TotalVotes"],
    ],
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  res.status(200).json({
    success: true,
    data,
    AllHorses,
  });
});
exports.GetEditRaceVerdict = Trackerror(async (req, res, next) => {
  const data = await RaceAndVerdictsHorseModel.findAll({
    where: { RaceToBePredict: req.params.id },
    include: { all: true },
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  res.status(200).json({
    success: true,
    data,
  });
});
exports.EditRaceVerdict = Trackerror(async (req, res, next) => {
  const { VerdictEntry } = req.body;
  const data = await RaceAndVerdictsHorseModel.findAll({
    where: { RaceToBePredict: req.params.id },
    include: { all: true },
  });
  console.log(req.body);
  console.log(VerdictEntry, "VerdictEntry");
  let VerdictEntryData = Conversion(VerdictEntry);
  console.log(VerdictEntryData, "dsad");
  await VerdictEntryData.map(async (singleverdict) => {
    await singleverdict.map(async (singleverdictdetail, i) => {
      singleverdictdetail = singleverdictdetail.split(",");
      await RaceAndVerdictsHorseModel.update(
        {
          VerdictName: singleverdictdetail[0] || data[i].VerdictName,
          Rank: singleverdictdetail[1] || data[i].Rank,
          RaceToBePredict: req.params.id || data[i].RaceToBePredict,
          HorseNo1: singleverdictdetail[2] || data[i].HorseNo1,
          HorseNo2: singleverdictdetail[3] || data[i].HorseNo2,
          HorseNo3: singleverdictdetail[4] || data[i].HorseNo3,
          Remarks: singleverdictdetail[5] || data[i].Remarks,
        },
        {
          where: {
            _id: singleverdictdetail[6],
          },
        }
      );
    });
  });
  res.status(200).json({
    success: true,
  });
});
exports.DeleteRaceVerdict = Trackerror(async (req, res, next) => {
  const data = await RaceAndVerdictsHorseModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });
  res.status(200).json({
    success: true,
    message: "Horse Has Been Delete Successfully",
    data,
  });
});
exports.DeleteRaceHorse = Trackerror(async (req, res, next) => {
  const data = await HorseAndRaceModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });
  res.status(200).json({
    success: true,
    message: "Horse Has Been Delete Successfully",
    data,
  });
});
exports.EditRaceVerdictv2 = Trackerror(async (req, res, next) => {
  const {
    VerdictName,
    Rank,
    RaceToBePredict,
    HorseNo2,
    HorseNo1,
    HorseNo3,
    Remarks,
    Rowid,
  } = req.body;
  const data = await RaceAndVerdictsHorseModel.findOne({
    where: { RaceToBePredict: req.params.id },
  });
  // console.log(req.body);
  // console.log(VerdictEntry, "VerdictEntry");
  // let VerdictEntryData = Conversion(VerdictEntry);
  // console.log(VerdictEntryData, "dsad");
  // await VerdictEntryData.map(async (singleverdict) => {
  await RaceAndVerdictsHorseModel.update(
    {
      VerdictName: VerdictName || data[i].VerdictName,
      Rank: Rank || data[i].Rank,
      RaceToBePredict: req.params.id || data[i].RaceToBePredict,
      HorseNo1: HorseNo1 || data[i].HorseNo1,
      HorseNo2: HorseNo2 || data[i].HorseNo2,
      HorseNo3: HorseNo3 || data[i].HorseNo3,
      Remarks: Remarks || data[i].Remarks,
    },
    {
      where: {
        _id: Rowid,
      },
    }
  );
  // });
  res.status(200).json({
    success: true,
    message: "data has been updated",
  });
});

exports.GetEditRaceHorses = Trackerror(async (req, res, next) => {
  const data = await HorseAndRaceModel.findAll({
    order: [["HorseNo", "ASC"]],
    where: { RaceModelId: req.params.id },
    include: { all: true },
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  res.status(200).json({
    success: true,
    data,
  });
});
exports.EditRaceHorsesv2 = Trackerror(async (req, res, next) => {
  const {
    GateNo,
    HorseNo,
    HorseModelId,
    Equipment,
    TrainerOnRace,
    OwnerOnRace,
    JockeyOnRace,
    JockeyWeight,
    Rating,
    HorseRunningStatus,
    CapColor,
    JockeyRaceWeight,
    Rowid,
  } = req.body;
  let racehorsedata = await HorseAndRaceModel.findOne({
    where: { HorseModelId: HorseModelId },
  });
  let horsedata = await HorseModel.findOne({
    where: { _id: HorseModelId },
  });
  console.log(horsedata, "Dsdsd");
  await HorseAndRaceModel.update(
    {
      GateNo: GateNo || racehorsedata.GateNo,
      HorseNo: HorseNo || racehorsedata.HorseNo,
      RaceModelId: req.params.id,
      HorseModelId: HorseModelId || racehorsedata.HorseModelId,
      Equipment: Equipment || racehorsedata.Equipment,
      TrainerOnRace: horsedata.TrainerOnRace,
      OwnerOnRace: horsedata.OwnerOnRace,
      JockeyOnRace: JockeyOnRace || racehorsedata.JockeyOnRace,
      JockeyWeight: JockeyWeight || racehorsedata.JockeyWeight,
      Rating: Rating || racehorsedata.Rating,
      HorseRunningStatus:
        HorseRunningStatus || racehorsedata.HorseRunningStatus,
      CapColor: CapColor || racehorsedata.CapColor,
      JockeyRaceWeight: JockeyRaceWeight || racehorsedata.JockeyRaceWeight,
    },
    {
      where: {
        _id: Rowid,
      },
    }
  );

  res.status(200).json({
    success: true,
    message: "data has been updated",
  });
});
exports.EditRaceHorses = Trackerror(async (req, res, next) => {
  const { HorseEntry } = req.body;
  console.log(req.body);
  let HorseEntryData = Conversion(HorseEntry);
  console.log(HorseEntryData, "dsad");
  let horsedata;
  let racehorsedata;
  await HorseEntryData.map(async (singlehorse, i) => {
    // await singlehorse.map(async (singlehorsedetail, i) => {
    singlehorse = singlehorse.split(",");
    console.log("00077792-262c-4831-b5f2-8209912447fa", "hello");
    racehorsedata = await HorseAndRaceModel.findOne({
      where: { HorseModelId: "00077792-262c-4831-b5f2-8209912447fa" },
    });
    horsedata = await HorseModel.findOne({
      where: {
        _id: "00077792-262c-4831-b5f2-8209912447fa",
      },
    });
    console.log(racehorsedata, "racehorsedata");
    console.log(racehorsedata.Equipment, "racehorsedata1222");
    try {
      await HorseAndRaceModel.update(
        {
          GateNo: singlehorse[0] || racehorsedata.GateNo,
          HorseNo: singlehorse[1] || racehorsedata.HorseNo,
          RaceModelId: req.params.id,
          HorseModelId:
            "00077792-262c-4831-b5f2-8209912447fa" ||
            racehorsedata.HorseModelId,
          Equipment: racehorsedata.Equipment,
          TrainerOnRace: horsedata.ActiveTrainer || racehorsedata.TrainerOnRace,
          OwnerOnRace: horsedata.ActiveOwner || racehorsedata.OwnerOnRace,
          JockeyOnRace: racehorsedata.JockeyOnRace,
          JockeyWeight: racehorsedata.JockeyWeight,
          Rating: singlehorse[6] || racehorsedata.Rating,
          HorseRunningStatus:
            singlehorse[7] || racehorsedata.HorseRunningStatus,
          CapColor: racehorsedata.CapColor,
          JockeyRaceWeight: singlehorse[9] || racehorsedata.JockeyRaceWeight,
        },
        {
          where: {
            _id: singlehorse[10],
          },
        }
      );
    } catch (err) {
      console.log(err);
    }

    horsedata = null;
  });
  res.status(200).json({
    success: true,
  });
});
// });
