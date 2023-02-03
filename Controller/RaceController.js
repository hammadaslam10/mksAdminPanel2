const db = require("../config/Connection");
const RaceModel = db.RaceModel;
const HorseModel = db.HorseModel;
const RaceAndPointsSystemModel = db.RaceAndPointsSystemModel;
const SubscriberAndCompetitionModel = db.SubscriberAndCompetitionModel;
const RaceAndHorseModel = db.RaceAndHorseModel;
const HorseAndRaceModel = db.HorseAndRaceModel;
const RaceAndJockeyModel = db.RaceAndJockeyModel;
const RaceCourseModel = db.RaceCourseModel;
const ResultsModel = db.ResultModel;
const ResultModel = db.ResultModel;
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
  const totalcount = await RaceModel.count();
  const data = await RaceModel.findAll({
    offset: Number(req.query.page) - 1 || 0,
    limit: Number(req.query.limit) || 10,
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
  });
  res.status(200).json({
    success: true,
    data: data,
    totalcount,
    filtered: data.length,
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
  const data = await RaceModel.findOne({
    where: { _id: req.params.id, ResultStatus: "Announced" },
  });
  if (!data) {
    return new next(
      "Race is not available or Result is not declared yet ",
      404
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
    order: [["createdAt", "DESC"]],
  });
  const data = await RaceModel.findOne({
    where: {
      _id: result.RaceModelId,
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
      },
      {
        model: db.CompetitonModel,
        as: "CompetitionRacesPointsModelData",
        include: { all: true },
      },
      {
        model: db.JockeyModel,
        include: [
          {
            model: db.NationalityModel,
            as: "JockeyNationalityData",
            paranoid: false,
          },
        ],
      },
    ],
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.ResultLatest = Trackerror(async (req, res, next) => {
  const result = await ResultModel.findOne({
    order: [["createdAt", "DESC"]],
  });
  const data = await RaceModel.findOne({
    include: [
      {
        where: {
          RaceID: result.RaceID
        },
        model: db.ResultModel,
        as: "RaceResultData",
        include: { all: true }
      }
      , {
        model: db.RaceNameModel,
        as: "RaceNameModelData",

      }

    ],
    attributes: ["_id"],
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.RaceSliderTimeAccording = Trackerror(async (req, res, next) => { });
exports.SingleRace = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findOne({
    where: { _id: req.params.id, HorseFilled: true },
    include: [
      {
        model: db.MeetingTypeModel,
        as: "MeetingTypeData",
      },
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
        model: db.CompetitonModel,
        as: "CompetitionRacesPointsModelData",
        include: { all: true },
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
      {
        model: db.JockeyModel,
        include: [
          {
            model: db.NationalityModel,
            as: "JockeyNationalityData",
            paranoid: false,
          },
        ],
      },
    ],
  });
  if (!data) {
    return next(new HandlerCallBack("Race is Not Available", 404));
  } else {
    res.status(200).json({
      success: true,
      data,
    });
  }
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
    TrackCondition,
    RaceNumber,
    totalPrize,
    PrizeNumber,
    RaceWeight,
    Currency,
  } = req.body;
  let = {
    FirstPrice,
    SecondPrice,
    ThirdPrice,
    FourthPrice,
    FifthPrice,
    SixthPrice,
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
    TrackCondition: TrackCondition,
    RaceWeight: RaceWeight,
    Currency: Currency,
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
  console.log(HorseEntryData, "dsad");
  let horsedata;
  await HorseEntryData.map(async (singlehorse) => {
    await singlehorse.map(async (singlehorsedetail) => {
      singlehorsedetail = singlehorsedetail.split(",");
      horsedata = await HorseModel.findOne({
        where: {
          _id: singlehorsedetail[2],
        },
      });
      console.log(horsedata);
      try {
        await HorseAndRaceModel.findOrCreate({
          where: {
            GateNo: singlehorsedetail[0],
            HorseNo: singlehorsedetail[1],
            RaceModelId: req.params.id,
            HorseModelId: singlehorsedetail[2],
            Equipment: singlehorsedetail[3],
            TrainerOnRace: horsedata.ActiveTrainer,
            OwnerOnRace: horsedata.ActiveOwner,
            JockeyOnRace: singlehorsedetail[4],
            JockeyWeight: singlehorsedetail[5],
            Rating: singlehorsedetail[6],
            HorseRunningStatus: singlehorsedetail[7],
            CapColor: singlehorsedetail[8],
            JockeyRaceWeight: singlehorsedetail[9],
          },
        });
      } catch (err) {
        console.log(err);
        // res.send({
        //   message: err
        // });
        // res.end();
        // return;
      }

      horsedata = null;
    });
  });
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
    data = await RaceModel.update(req.body, {
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
  console.log(req.body);
  console.log(VerdictEntry, "VerdictEntry");
  let VerdictEntryData = Conversion(VerdictEntry);
  console.log(VerdictEntryData, "dsad");
  await VerdictEntryData.map(async (singleverdict) => {
    await singleverdict.map(async (singleverdictdetail) => {
      singleverdictdetail = singleverdictdetail.split(",");
      await RaceAndVerdictsHorseModel.update(
        {
          VerdictName: singleverdictdetail[0],
          Rank: singleverdictdetail[1],
          RaceToBePredict: req.params.id,
          HorseNo1: singleverdictdetail[2],
          HorseNo2: singleverdictdetail[3],
          HorseNo3: singleverdictdetail[4],
          Remarks: singleverdictdetail[5],
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
exports.GetEditRaceHorses = Trackerror(async (req, res, next) => {
  const data = await HorseAndRaceModel.findAll({
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
exports.EditRaceHorses = Trackerror(async (req, res, next) => {
  const { HorseEntry } = req.body;
  console.log(req.body);
  let HorseEntryData = Conversion(HorseEntry);
  console.log(HorseEntryData, "dsad");
  let horsedata;
  await HorseEntryData.map(async (singlehorse) => {
    await singlehorse.map(async (singlehorsedetail) => {
      singlehorsedetail = singlehorsedetail.split(",");
      horsedata = await HorseModel.findOne({
        where: {
          _id: singlehorsedetail[2],
        },
      });
      console.log(horsedata);
      try {
        await HorseAndRaceModel.update(
          {
            GateNo: singlehorsedetail[0],
            HorseNo: singlehorsedetail[1],
            RaceModelId: req.params.id,
            HorseModelId: singlehorsedetail[2],
            Equipment: singlehorsedetail[3],
            TrainerOnRace: horsedata.ActiveTrainer,
            OwnerOnRace: horsedata.ActiveOwner,
            JockeyOnRace: singlehorsedetail[4],
            JockeyWeight: singlehorsedetail[5],
            Rating: singlehorsedetail[6],
            HorseRunningStatus: singlehorsedetail[7],
            CapColor: singlehorsedetail[8],
          },
          {
            where: {
              _id: singlehorsedetail[9],
            },
          }
        );
      } catch (err) {
        console.log(err);
      }

      horsedata = null;
    });
  });
  res.status(200).json({
    success: true,
  });
});
