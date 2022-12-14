const db = require("../config/Connection");
const RaceModel = db.RaceModel;
const RaceAndPointsSystemModel = db.RaceAndPointsSystemModel;
const RaceAndHorseModel = db.RaceAndHorseModel;
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
exports.GetDeletedRace = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findAll({
    paranoid: false,
    where: {
      [Op.not]: { deletedAt: null }
    },
    include: [
      {
        model: db.MeetingTypeModel,
        as: "MeetingTypeData"
      },
      {
        model: db.GroundTypeModel,
        as: "GroundData"
      },
      {
        model: db.RaceCourseModel,
        as: "RaceCourseData",
        paranoid: false
      },
      {
        model: db.TrackLengthModel,
        as: "TrackLengthData"
      },
      {
        model: db.RaceNameModel,
        as: "RaceNameModelData"
      },
      {
        model: db.RaceKindModel,
        as: "RaceKindData"
      },
      {
        model: db.RaceTypeModel,
        as: "RaceTypeModelData"
      },
      {
        model: db.SponsorModel,
        as: "SponsorData"
      },
      {
        model: db.HorseModel,
        as: "RaceAndHorseModelData",
        include: { all: true },
        paranoid: false
      },
      {
        model: db.JockeyModel,
        include: { all: true },
        paranoid: false
      },
      {
        model: db.ResultModel,
        as: "RaceResultData",
        include: { all: true },
        paranoid: false
      }
    ]
  });
  res.status(200).json({
    success: true,
    data
  });
});
exports.SearchRace = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findAll({
    offset: Number(req.query.page) || 0,
    limit: Number(req.query.limit) || 10,
    order: [[req.query.orderby || "createdAt", req.query.sequence || "ASC"]],
    where: {
      MeetingType: {
        [Op.like]: `%${req.query.MeetingType || ""}%`
      },
      MeetingCode: {
        [Op.like]: `%${req.query.MeetingCode || ""}%`
      },
      RaceName: {
        [Op.like]: `%${req.query.RaceName || ""}%`
      },
      TrackLength: {
        [Op.like]: `%${req.query.TrackLength || ""}%`
      },
      Ground: {
        [Op.like]: `%${req.query.Ground || ""}%`
      },
      DescriptionAr: {
        [Op.like]: `%${req.query.DescriptionAr || ""}%`
      },
      DescriptionEn: {
        [Op.like]: `%${req.query.DescriptionEn || ""}%`
      },
      RaceStatus: {
        [Op.like]: `%${req.query.RaceStatus || ""}%`
      },
      ResultStatus: {
        [Op.like]: `%${req.query.ResultStatus || ""}%`
      },
      RaceCourse: {
        [Op.like]: `%${req.query.RaceCourse || ""}%`
      },
      RaceType: {
        [Op.like]: `%${req.query.RaceType || ""}%`
      },
      HorseFilled: {
        [Op.like]: `%${req.query.HorseFilled || ""}%`
      },
      WeatherType: {
        [Op.like]: `%${req.query.WeatherType || ""}%`
      },
      WeatherDegree: {
        [Op.like]: `%${req.query.WeatherDegree || ""}%`
      },
      WeatherIcon: {
        [Op.like]: `%${req.query.WeatherIcon || ""}%`
      },
      RaceType: {
        [Op.like]: `%${req.query.RaceType || ""}%`
      },
      PointTableSystem: {
        [Op.like]: `%${req.query.PointTableSystem || ""}%`
      },
      RaceCard: {
        [Op.like]: `%${req.query.RaceCard || ""}%`
      },
      Competition: {
        [Op.like]: `%${req.query.Competition || ""}%`
      },
      Sponsor: {
        [Op.like]: `%${req.query.Sponsor || ""}%`
      },
      StartDate: {
        [Op.between]: [
          req.query.racestartdate1 || "2021-12-01 00:00:00",
          req.query.racestartdate2 || "4030-12-01 00:00:00"
        ]
      },
      EndDate: {
        [Op.between]: [
          req.query.raceenddate1 || "2021-12-01 00:00:00",
          req.query.raceenddate2 || "4030-12-01 00:00:00"
        ]
      },
      Day: {
        [Op.between]: [
          req.query.racestartday || "2021-12-01 00:00:00",
          req.query.raceendday || "4030-12-01 00:00:00"
        ]
      },

      createdAt: {
        [Op.between]: [
          req.query.startdate || "2021-12-01 00:00:00",
          req.query.endDate || "4030-12-01 00:00:00"
        ]
      }
    }
  });
  res.status(200).json({
    success: true,
    data
  });
});
exports.RestoreSoftDeletedRace = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findOne({
    paranoid: false,
    where: { _id: req.params.id }
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const restoredata = await RaceModel.restore({
    where: { _id: req.params.id }
  });
  res.status(200).json({
    success: true,
    restoredata
  });
});

exports.GetHorsesofraces = Trackerror(async (req, res, next) => {
  let raceid = await RaceModel.findOne({
    where: {
      _id: req.params.id
    }
  });
  if (raceid == null) {
    return next(new HandlerCallBack("Race not found", 404));
  }
  const data = await db.RaceModel.findAll({
    where: {
      _id: req.params.id
    },
    include: [
      {
        model: db.HorseModel,
        as: "RaceCardRacesModelData",
        include: { all: true }
      }
    ]
  });
  res.status(200).json({
    success: true,
    data
  });
});
exports.GetRace = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findAll({
    where: { HorseFilled: true },
    include: [
      {
        paranoid: false,
        model: db.MeetingTypeModel,
        as: "MeetingTypeData"
      },
      {
        paranoid: false,
        model: db.GroundTypeModel,
        as: "GroundData"
      },
      {
        model: db.RaceCourseModel,
        as: "RaceCourseData",
        paranoid: false
      },
      {
        paranoid: false,
        model: db.TrackLengthModel,
        as: "TrackLengthData"
      },
      {
        paranoid: false,
        model: db.RaceNameModel,
        as: "RaceNameModelData"
      },
      {
        paranoid: false,
        model: db.RaceKindModel,
        as: "RaceKindData"
      },
      {
        model: db.RaceTypeModel,
        as: "RaceTypeModelData"
      },
      {
        paranoid: false,
        model: db.SponsorModel,
        as: "SponsorData"
      },
      {
        model: db.HorseModel,
        as: "RaceAndHorseModelData",
        include: { all: true },
        paranoid: false
      },
      {
        model: db.JockeyModel,
        include: { all: true },
        paranoid: false
      },
      {
        model: db.ResultModel,
        as: "RaceResultData",
        include: { all: true },
        paranoid: false
      }
    ]
  });

  res.status(200).json({
    success: true,
    data
  });
});
exports.RaceWithTime = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findAll({
    order: [["StartTime", "ASC"]],
    paranoid: false,
    include: [
      {
        model: db.RaceCourseModel,
        as: "RaceCourseData",
        paranoid: false
      },
      {
        model: db.TrackLengthModel,
        as: "TrackLengthData",
        paranoid: false
      },
      {
        model: db.RaceNameModel,
        as: "RaceNameModelData",
        paranoid: false
      }
    ]
  });

  res.status(200).json({
    success: true,
    data
  });
});
exports.GetRaceResultToBeAnnounced = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findAll({
    where: {
      [Op.and]: [
        {
          ResultStatus: "Awaited"
        },
        { RaceStatus: "Completed" }
      ]
    },
    include: [
      {
        model: db.MeetingTypeModel,
        as: "MeetingTypeData"
      },
      {
        model: db.GroundTypeModel,
        as: "GroundData"
      },
      {
        model: db.RaceCourseModel,
        as: "RaceCourseData"
      },
      {
        model: db.TrackLengthModel,
        as: "TrackLengthData"
      },
      {
        model: db.RaceNameModel,
        as: "RaceNameModelData"
      },
      {
        model: db.RaceKindModel,
        as: "RaceKindData"
      },
      {
        model: db.RaceTypeModel,
        as: "RaceTypeModelData"
      },
      {
        model: db.SponsorModel,
        as: "SponsorData"
      },
      {
        model: db.HorseModel,
        as: "RaceAndHorseModelData",
        include: { all: true }
      },
      {
        model: db.JockeyModel,
        include: { all: true }
      }
    ]
  });

  res.status(200).json({
    success: true,
    data
  });
});
exports.CancelRace = Trackerror(async (req, res, next) => {
  const data = {
    RaceStatus: "Cancelled",
    ResultStatus: "Cancelled"
  };
  await RaceModel.update(
    { data },
    {
      where: {
        _id: req.params.id
      }
    }
  );
  res.status(200).json({
    success: true,
    message: "Race has been cancelled"
  });
});
exports.GetRaceTobeOPublished = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findAll({
    where: { HorseFilled: false },
    include: { all: true }
  });
  res.status(200).json({
    success: true,
    data
  });
});
exports.RaceOrderByCountry = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findAll({
    where: { HorseFilled: true },
    // order: [["RaceCourse", "DESC"]],
    include: {
      model: RaceCourseModel,
      as: "RaceCourseData"
    },
    order: [["RaceCourseData", "Country", "DESC"]]
  });
  res.status(200).json({
    success: true,
    data
  });
});
exports.RaceOrderByRaceCourseOnly = Trackerror(async (req, res, next) => {
  const RaceCourseName = await RaceCourseModel.findAll({
    include: { all: true },
    attributes: ["Country"],
    group: "Country"
  });
  const data = await RaceModel.findAll({
    where: { HorseFilled: true },
    order: [["RaceStatus", "ASC"]],
    include: {
      model: RaceCourseModel,
      as: "RaceCourseData",
      // where: { TrackName: req.params.RaceCourseName },
      attributes: ["Country", "TrackName"]
    }
  });
  res.status(200).json({
    success: true,
    RaceCourseName,
    data
  });
});
exports.PublishRaces = Trackerror(async (req, res, next) => {
  let data = await RaceModel.findOne({
    where: { _id: req.params.id }
  });
  if (!data) {
    return next(new HandlerCallBack("Race Is Not Available", 404));
  }
  data = await RaceModel.update(
    { HorseFilled: true },
    {
      where: {
        _id: req.params.id
      }
    }
  );
  res.status(200).json({
    success: true,
    data
  });
});
exports.AddRaceImage = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findOne({
    where: { _id: req.params.id, ResultStatus: "Announced" }
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
        images: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${RaceImages}/${SingleImage}`
      }
    });
  });
  res.status(201).json({
    success: true,
    message: "all images are been submitted"
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
          // Rank: SingleResultEntryDetail[0],
          HorseID: SingleResultEntryDetail[0],
          Prize: SingleResultEntryDetail[1],
          Points: SingleResultEntryDetail[2],
          BonusPoints: SingleResultEntryDetail[3],
          VideoLink: SingleResultEntryDetail[4],
          FinalPosition: SingleResultEntryDetail[5]
        }
      });
    });
  });
  const race = await RaceModel.update(
    { ResultStatus: "Announced" },
    {
      where: {
        _id: req.params.RaceId
      }
    }
  );
  res.status(200).json({
    success: true,
    race
  });
});
exports.VerdictLatest = Trackerror(async (req, res, next) => {
  const result = await RaceAndVerdictsHorseModel.findOne({
    order: [["createdAt", "DESC"]]
  });
  const data = await RaceModel.findOne({
    where: {
      _id: result.RaceModelId
    },
    include: [
      {
        model: db.MeetingTypeModel,
        as: "MeetingTypeData"
      },
      {
        model: db.GroundTypeModel,
        as: "GroundData"
      },
      {
        model: db.RaceCourseModel,
        as: "RaceCourseData"
      },
      {
        model: db.TrackLengthModel,
        as: "TrackLengthData"
      },
      {
        model: db.RaceNameModel,
        as: "RaceNameModelData"
      },
      {
        model: db.RaceKindModel,
        as: "RaceKindData"
      },
      {
        model: db.RaceTypeModel,
        as: "RaceTypeModelData"
      },
      {
        model: db.SponsorModel,
        as: "SponsorData"
      },
      {
        model: db.HorseModel,
        as: "RaceAndHorseModelData",
        include: { all: true }
      },
      {
        model: db.CompetitonModel,
        as: "CompetitionRacesPointsModelData",
        include: { all: true }
      },
      {
        model: db.JockeyModel,
        include: [
          {
            model: db.NationalityModel,
            as: "JockeyNationalityData",
            paranoid: false
          }
        ]
      }
    ]
  });
  res.status(200).json({
    success: true,
    data
  });
});
exports.ResultLatest = Trackerror(async (req, res, next) => {
  const result = await ResultModel.findOne({
    order: [["createdAt", "DESC"]]
  });
  const data = await RaceModel.findOne({
    include: [
      {
        // where: {
        //   RaceID: result.RaceID
        // },
        model: db.ResultModel,
        as: "RaceResultData",
        include: [
          {
            model: db.HorseModel,
            as: "HorseIDData",
            include: { all: true }
          }
        ]
      }
    ]
  });
  res.status(200).json({
    success: true,
    data
  });
});
exports.RaceSliderTimeAccording = Trackerror(async (req, res, next) => {});
exports.SingleRace = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findOne({
    where: { _id: req.params.id, HorseFilled: true },
    include: [
      {
        model: db.MeetingTypeModel,
        as: "MeetingTypeData"
      },
      {
        model: db.GroundTypeModel,
        as: "GroundData"
      },
      {
        model: db.RaceCourseModel,
        as: "RaceCourseData"
      },
      {
        model: db.TrackLengthModel,
        as: "TrackLengthData"
      },
      {
        model: db.RaceNameModel,
        as: "RaceNameModelData"
      },
      {
        model: db.RaceKindModel,
        as: "RaceKindData"
      },
      {
        model: db.RaceTypeModel,
        as: "RaceTypeModelData"
      },
      {
        model: db.SponsorModel,
        as: "SponsorData"
      },
      {
        model: db.HorseModel,
        as: "RaceAndHorseModelData",
        include: { all: true }
      },
      {
        model: db.CompetitonModel,
        as: "CompetitionRacesPointsModelData",
        include: { all: true }
      },
      {
        model: db.ResultModel,
        as: "RaceResultData",
        include: { all: true },
        paranoid: false
      },
      {
        model: db.JockeyModel,
        include: [
          {
            model: db.NationalityModel,
            as: "JockeyNationalityData",
            paranoid: false
          }
        ]
      }
    ]
  });
  if (!data) {
    return next(new HandlerCallBack("Race is Not Available", 404));
  } else {
    res.status(200).json({
      success: true,
      data
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
    TrackCondition
  } = req.body;
  const file = req.files.image;
  if (file == null) {
    return next(new HandlerCallBack("Please upload an image", 404));
  }
  const Image = generateFileName();
  const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
  console.log(req.files.image.data);
  await uploadFile(fileBuffer, `${Race}/${Image}`, file.mimetype);

  const data = await RaceModel.create({
    image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Race}/${Image}`,
    RaceKind: RaceKind,
    DescriptionEn: DescriptionEn,
    DescriptionAr: DescriptionAr,
    RaceCourse: RaceCourse,
    RaceStatus: RaceStatus,
    StartTime: StartTime,
    EndTime: EndTime,
    RaceType: RaceType,
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
    TrackCondition: TrackCondition
  });
  res.status(200).json({
    success: true,
    data
  });
});
exports.AddPointTable = Trackerror(async (req, res, next) => {
  let RaceId = await RaceModel.findOne({
    where: { _id: req.params.id }
  });
  if (!RaceId) {
    return next(new HandlerCallBack("Race Card not found", 404));
  } else {
    let { Points } = req.body;

    await Points.map(async (singlepoint) => {
      await RaceAndPointsSystemModel.create({
        Race: req.params.id,
        Point: singlepoint
      });
    });
    await RaceModel.update(
      { role: "approveduser" },
      {
        where: {
          _id: req.params.id
        }
      }
    );
    res.status(200).json({
      success: true
    });
  }
});
exports.IncludeHorses = Trackerror(async (req, res, next) => {
  const { HorseEntry } = req.body;
  console.log(req.body);
  let HorseEntryData = Conversion(HorseEntry);
  console.log(HorseEntryData, "dsad");
  await HorseEntryData.map(async (singlehorse) => {
    await singlehorse.map(async (singlehorsedetail) => {
      singlehorsedetail = singlehorsedetail.split(",");
      console.log(singlehorsedetail[0], "0 INDEX");
      console.log(singlehorsedetail[1], "1 INDEX");
      console.log(singlehorsedetail[2], "2 INDEX");
      console.log(singlehorsedetail[3], "3 INDEX");
      await RaceAndHorseModel.findOrCreate({
        where: {
          GateNo: singlehorsedetail[0],
          RaceModelId: req.params.id,
          HorseModelId: singlehorsedetail[1],
          Equipment: singlehorsedetail[4]
        }
      });
      await RaceAndJockeyModel.findOrCreate({
        where: {
          GateNo: singlehorsedetail[0],
          JockeyModelId: singlehorsedetail[2],
          RaceModelId: req.params.id,
          JockeyWeight: singlehorsedetail[3]
        }
      });
    });
  });
  res.status(200).json({
    success: true
  });
});
exports.IncludeVerdicts = Trackerror(async (req, res, next) => {
  const { VerdictEntry } = req.body;
  console.log(req.body);
  let VerdictEntryData = Conversion(VerdictEntry);
  console.log(VerdictEntryData, "dsad");
  await VerdictEntryData.map(async (singleverdict) => {
    await singleverdict.map(async (singleverdictdetail) => {
      singleverdictdetail = singleverdictdetail.split(",");
      console.log(singleverdictdetail[0], "0 INDEX");
      console.log(singleverdictdetail[1], "1 INDEX");
      console.log(singleverdictdetail[2], "2 INDEX");
      console.log(singleverdictdetail[3], "3 INDEX");

      await RaceAndVerdictsHorseModel.findOrCreate({
        where: {
          VerdictName: singleverdictdetail[0],
          Rank: singleverdictdetail[1],
          RaceModelId: req.params.id,
          HorseModelId: singleverdictdetail[2]
        }
      });
    });
  });
  res.status(200).json({
    success: true
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
      _id: arrayof_ids
    },
    include: [
      {
        model: db.MeetingTypeModel,
        as: "MeetingTypeData"
      },
      {
        model: db.GroundTypeModel,
        as: "GroundData"
      },
      {
        model: db.RaceCourseModel,
        as: "RaceCourseData"
      },
      {
        model: db.TrackLengthModel,
        as: "TrackLengthData"
      },
      {
        model: db.RaceNameModel,
        as: "RaceNameModelData"
      },
      {
        model: db.RaceKindModel,
        as: "RaceKindData"
      },
      {
        model: db.RaceTypeModel,
        as: "RaceTypeModelData"
      },
      {
        model: db.SponsorModel,
        as: "SponsorData"
      },
      {
        model: db.HorseModel,
        as: "RaceAndHorseModelData",
        include: { all: true }
      },
      {
        model: db.JockeyModel,
        include: [{ model: db.NationalityModel, as: "JockeyNationalityData" }]
      }
    ]
  });
  console.log(data.length);
  res.status(200).json({
    success: true,
    data
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
    TrackCondition
  } = req.body;
  let data = await RaceModel.findOne({
    where: { _id: req.params.id }
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  if (req.files == null) {
    data = await RaceModel.update(req.body, {
      where: {
        _id: req.params.id
      }
    });
    res.status(200).json({
      success: true,
      data
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
      TrackCondition: TrackCondition || data.TrackCondition
    };
    data = await RaceModel.update(updateddata, {
      where: {
        _id: req.params.id
      }
    });
    res.status(200).json({
      success: true,
      data
    });
  }
});
exports.DeleteRace = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findOne({
    where: { _id: req.params.id },
    include: { all: true }
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);
  await RaceModel.destroy({
    where: { _id: req.params.id },
    force: true
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully"
  });
});
exports.SoftDeleteRace = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findOne({
    where: { _id: req.params.id }
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);
  await RaceModel.destroy({
    where: { _id: req.params.id }
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully"
  });
});
exports.GetRaceonTimeAndRaceCourse = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findAll({
    where: {
      [Op.and]: [
        { RaceCourse: req.params.RaceCourseid },
        { StartTime: req.params.StartTime }
      ]
    }
  });
  res.status(200).json({
    success: true,
    data
  });
});
