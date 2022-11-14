const db = require("../config/Connection");
const RaceModel = db.RaceModel;
const RaceAndHorseModel = db.RaceAndHorseModel;
const RaceAndJockeyModel = db.RaceAndJockeyModel;
const RaceCourseModel = db.RaceCourseModel;
const ResultModel = db.ResultModel;
const { Race } = require("../Utils/Path");
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { Trainer, Jockey, Owner, Horse, RaceCourse } = require("../Utils/Path");
const Features = require("../Utils/Features");
const { Conversion } = require("../Utils/Conversion");
const { uploadFile, deleteFile } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");

exports.GetRace = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findAll({
    where: { HorseFilled: true },
    include: { all: true },
  });
  res.status(200).json({
    success: true,
    data,
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
exports.RacePrizeMoney = Trackerror(async (req, res, next) => {
  const { Rank, PrizeAmount, Points, HorseId, BonusPoints, RaceType } =
    req.body;
  const data = await ResultModel.create({
    RaceId: req.params.RaceId,
    HorseId: HorseId,
    Rank: Rank,
    PrizeAmount: PrizeAmount,
    Points: Points,
    BonusPoints: BonusPoints,
    RaceType: RaceType,
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.RaceSliderTimeAccording = Trackerror(async (req, res, next) => {});
exports.SingleRace = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findOne({
    where: { _id: req.params.id },
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
    raceName,
    DescriptionEn,
    RaceCourse,
    Horses,
    Prizes,
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
    Sponsor,
  } = req.body;
  const file = req.files.image;
  const Image = generateFileName();
  const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
  console.log(req.files.image.data);
  await uploadFile(fileBuffer, `${Race}/${Image}`, file.mimetype);
  const data = await RaceModel.create({
    image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Race}/${Image}`,
    RaceKind: RaceKind,
    raceName: raceName,
    DescriptionEn: DescriptionEn,
    DescriptionAr: DescriptionAr,
    RaceCourse: RaceCourse,
    Prizes: Prizes,
    RaceStatus: RaceStatus,
    DayNTime: DayNTime,
    RaceType: RaceType,
    RaceNameAr: RaceNameAr,
    RaceNameAr: RaceNameAr,
    WeatherType: WeatherType,
    WeatherType: WeatherType,
    WeatherDegree: WeatherDegree,
    WeatherDegree: WeatherDegree,
    WeatherIcon: WeatherIcon,
    RaceName: RaceName,
    TrackLength: TrackLength,
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
    Sponsor: Sponsor,
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.IncludeHorses = Trackerror(async (req, res, next) => {
  const { HorseEntry } = req.body;
  console.log(req.body);
  let HorseEntryData = Conversion(HorseEntry);
  console.log(HorseEntryData);
  await HorseEntryData.map(async (SingleEntry, index) => {
    SingleEntry = SingleEntry.split(",");
    console.log(SingleEntry[0]);
    console.log(SingleEntry[1]);
    console.log(SingleEntry[2]);
    console.log(SingleEntry[3]);
    await RaceAndHorseModel.findOrCreate({
      where: {
        GateNo: SingleEntry[0],
        JockeyModelId: SingleEntry[2],
        RaceModelId: req.params.id,
      },
    });
    await RaceAndJockeyModel.findOrCreate({
      where: {
        GateNo: SingleEntry[0],
        RaceModelId: req.params.id,
        HorseModelId: SingleEntry[1],
        JockeyWeight: SingleEntry[3],
      },
    });
  });
  res.status(200).json({
    success: true,
  });
});
exports.IncludeVerdicts = Trackerror(async (req, res, next) => {
  // const { VerdictsEntry } = req.body;
  // console.log(req.body);
  // let VerdictsEntryData = Conversion(VerdictsEntry);
  // console.log(VerdictsEntryData);
  // await VerdictsEntryData.map(async (SingleEntry, index) => {
  //   SingleEntry = SingleEntry.split(",");
  //   console.log(SingleEntry[0]);
  //   console.log(SingleEntry[1]);
  //   console.log(SingleEntry[2]);
  //   console.log(SingleEntry[3]);
  //   await RaceAndVerdictsModel.findOrCreate({
  //     where: {
  //       GateNo: SingleEntry[0],
  //       JockeyModelId: SingleEntry[2],
  //       RaceModelId: req.params.id,
  //     },
  //   });
  // });
  // res.status(200).json({
  //   success: true,
  // });
});
exports.EditRace = Trackerror(async (req, res, next) => {
  const {
    Age,
    NameEn,
    NameAr,
    Owner,
    ActiveTrainer,
    Breeder,
    Trainer,
    Remarks,
    HorseRating,
    Sex,
    Color,
    KindOfHorse,
    Dam,
    Sire,
    GSire,
    Earning,
    History,
    OverAllRating,
    ActiveJockey,
    ActiveOwner,
    Jockey,
  } = req.body;
  let data = await HorseModel.findOne({
    where: { _id: req.params.id },
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  if (req.files == null) {
    data = await HorseModel.update(req.body, {
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
      NameEn: NameEn || data.NameEn,
      Age: Age || data.Age,
      NameAr: NameAr || data.NameAr,
      ActiveTrainer: ActiveTrainer || data.ActiveTrainer,
      Breeder: Breeder || data.Breeder,
      Remarks: Remarks || data.Remarks,
      HorseRating: HorseRating || data.HorseRating,
      Sex: Sex || data.Sex,
      Color: Color || data.Color,
      KindOfHorse: KindOfHorse || data.KindOfHorse,
      Dam: Dam || data.Dam,
      Sire: Sire || data.Sire,
      GSire: GSire || data.GSire,
      Earning: Earning || data.Earning,
      History: History || data.History,
      OverAllRating: OverAllRating || data.OverAllRating,
      ActiveJockey: ActiveJockey || data.ActiveJockey,
      ActiveOwner: ActiveOwner || data.ActiveOwner,
    };
    data = await HorseModel.update(updateddata, {
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
  // await deleteFile(`${Race}/${data.image.slice(-64)}`);
  await RaceModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
