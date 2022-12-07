const db = require("../config/Connection");
const RaceModel = db.RaceModel;
const RaceAndHorseModel = db.RaceAndHorseModel;
const RaceAndJockeyModel = db.RaceAndJockeyModel;
const RaceCourseModel = db.RaceCourseModel;
const ResultModel = db.ResultModel;
const RaceAndVerdictsHorseModel = db.RaceAndVerdictsHorseModel;
const RaceAndVerdictsJockeyModel = db.RaceAndVerdictsJockeyModel;
const { Race } = require("../Utils/Path");
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { Trainer, Jockey, Owner, Horse, RaceCourse } = require("../Utils/Path");
const Features = require("../Utils/Features");
const { Conversion } = require("../Utils/Conversion");
const { uploadFile, deleteFile } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const { Op } = require("sequelize");
exports.GetHorsesofraces = Trackerror(async (req, res, next) => {
  let raceid = await RaceModel.findOne({
    where: {
      _id: req.params.id
    }
  });
  const data = await RaceAndHorseModel.findAll({
    where: {
      _id: req.params.id
    },
    include: { all: true }
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
exports.GetRaceResultToBeAnnounced = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findAll({
    where: { RaceStatus: "Awaited" },
    include: { all: true }
  });

  res.status(200).json({
    success: true,
    data
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
exports.ResultCreation = Trackerror(async (req, res, next) => {
  const { ResultEntry } = req.body;
  await ResultEntry.map(async (SingleResultEntry) => {
    await SingleResultEntry.findOrCreate({
      where: {
        RaceID: req.params.RaceCardId,
        RaceID: SingleResultEntry.HorseId,
        Rank: SingleResultEntry.Rank,
        Prize: SingleResultEntry.Prize,
        Points: SingleResultEntry.Points,
        BonusPoints: SingleResultEntry.BonusPoints
      }
    });
  });
  res.status(200).json({
    success: true,
    data
  });
});
exports.RaceSliderTimeAccording = Trackerror(async (req, res, next) => {});
exports.SingleRace = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findOne({
    where: { _id: req.params.id },
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
        include: { all: true }
      },
      {
        model: db.JockeyModel,
        include: [{ model: db.NationalityModel, as: "JockeyNationalityData" }]
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
    DayNTime,
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
    Sponsor
  } = req.body;
  const file = req.files.image;
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
    DayNTime: DayNTime,
    RaceType: RaceType,
    RaceNameAr: RaceNameAr,
    WeatherType: WeatherType,
    WeatherType: WeatherType,
    WeatherDegree: WeatherDegree,
    WeatherDegree: WeatherDegree,
    WeatherIcon: WeatherIcon,
    RaceName: RaceName,
    TrackLength: TrackLength,
    FirstPrice: FirstPrice,
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
    Sponsor: Sponsor
  });
  res.status(200).json({
    success: true,
    data
  });
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
      // await RaceAndVerdictsJockeyModel.findOrCreate({
      //   where: {
      //     VerdictName: singleverdictdetail[0],
      //     Rank: singleverdictdetail[1],
      //     RaceModelId2: req.params.id,
      //     JockeyModelId: singleverdictdetail[2],
      //   },
      // });

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
exports.EditRace = Trackerror(async (req, res, next) => {
  const {
    RaceKind,
    DescriptionEn,
    RaceCourse,
    RaceType,
    RaceStatus,
    DayNTime,
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
    Sponsor
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
      DayNTime: DayNTime || data.DayNTime,
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
      Sponsor: Sponsor || data.Sponsor
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
  // await deleteFile(`${Race}/${data.image.slice(-64)}`);
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
        { DayNTime: req.params.DayNTime }
      ]
    }
  });
  res.status(200).json({
    success: true,
    data
  });
});
