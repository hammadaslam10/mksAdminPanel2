const db = require("../config/Connection");
const RaceModel = db.RaceModel;
const RaceAndHorseModel = db.RaceAndHorseModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { getObjectSignedUrl, deleteFile } = require("../Utils/s3");
const { Trainer, Jockey, Owner, Horse, RaceCourse } = require("../Utils/Path");
const Features = require("../Utils/Features");
const { Conversion } = require("../Utils/Conversion");

exports.GetRace = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findAll({
    include: { all: true },
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
    return new next("Jockey is not available", 404);
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
    Description,
    RaceCourse,
    Horses,
    Prizes,
    RaceStatus,
    DayNTime,
  } = req.body;
  const data = await RaceModel.create({
    RaceKind: RaceKind,
    raceName: raceName,
    Description: Description,
    RaceCourse: RaceCourse,
    Prizes: Prizes,
    RaceStatus: RaceStatus,
    DayNTime: DayNTime,
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.IncludeHorses = Trackerror(async (req, res, next) => {
  // const RaceId = await RaceModel.findOne({
  //   where: { _id: req.params.id },
  // });

  const { HorseEntry } = req.body;
  let HorseEntryData = Conversion(HorseEntry);
  let data1 = await RaceAndHorseModel.findAll({
    where: { RaceModelId: req.params.id },
    attributes: ["HorseModelId"],
  });
  console.log(data1.HorseModelId);
  console.log(HorseEntryData);
  // await HorseEntryData.map(async (SingleEntry) => {
  //   console.log(SingleEntry);
  //   await RaceAndHorseModel.create({
  //     GateNo: 1,
  //     RaceModelId: req.params.id,
  //     HorseModelId: SingleEntry,
  //   });
  //   console.log("done");
  // });

  res.status(200).json({
    data1,
    success: true,
  });
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
    await deleteFile(`${Horse}/${data.image}`);
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${Horse}/${Image}`, file.mimetype);

    const updateddata = {
      HorseImage: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Horse}/${Image}`,
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
  await deleteFile(`${Horse}/${data.image.slice(-64)}`);
  await RaceModel.destroy({
    where: { _id: req.params.id },
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
  await deleteFile(`${Horse}/${data.image.slice(-64)}`);
  await RaceModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
