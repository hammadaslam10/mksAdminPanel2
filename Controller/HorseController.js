const db = require("../config/Connection");
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const TrainerModel = db.TrainerModel;
const HorseModel = db.HorseModel;
const OwnerModel = db.OwnerModel;
const JockeyModel = db.JockeyModel;
const Features = require("../Utils/Features");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const HorseJockeyComboModel = db.HorseJockeyComboModel;
const HorseOwnerComboModel = db.HorseOwnerComboModel;
const HorseTrainerComboModel = db.HorseTrainerComboModel;
const { uploadFile, deleteFile } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const { Horse } = require("../Utils/Path");
const { Conversion } = require("../Utils/Conversion");
exports.GetHorse = Trackerror(async (req, res, next) => {
  let data = await HorseModel.findAll({
    include: { all: true },
  });
  res.status(200).json({
    success: true,
    data,
  });
});

exports.SingleHorse = Trackerror(async (req, res, next) => {
  const data = await HorseModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return new next("Horse is not available", 404);
  } else {
    res.status(200).json({
      success: true,
      data,
    });
  }
});
exports.CreateHorse = Trackerror(async (req, res, next) => {
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
    NationalityId,
    Foal,
    PurchasePrice,
    Cap,
    Rds,
    ColorID,
  } = req.body;
  if (ArRegex.test(NameAr) && ArRegex.test(NameEn) == false) {
    const file = req.files.image;
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${Horse}/${Image}`, file.mimetype);
    const data = await HorseModel.create({
      HorseImage: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Horse}/${Image}`,
      NameEn: NameEn,
      Age: Age,
      NameAr: NameAr,
      ActiveTrainer: ActiveTrainer,
      Breeder: Breeder,
      Remarks: Remarks,
      HorseRating: HorseRating,
      Sex: Sex,
      Color: Color,
      KindOfHorse: KindOfHorse,
      Dam: Dam,
      Sire: Sire,
      GSire: GSire,
      Earning: Earning,
      History: History,
      OverAllRating: OverAllRating,
      // ActiveJockey: ActiveJockey,
      ActiveOwner: ActiveOwner,
      NationalityId: NationalityId,
      Foal: Foal,
      PurchasePrice: PurchasePrice,
      Cap: Cap,
      Rds: Rds,
      ColorID: ColorID,
    });

    if (data._id) {
      if (Owner) {
        let OwnerData = Conversion(Owner);
        OwnerData.push(ActiveOwner);
        await OwnerData.map(async (singleOwner) => {
          await HorseOwnerComboModel.create({
            HorseModelId: data._id,
            OwnerModelId: singleOwner,
          });
        });
      }

      if (Trainer) {
        let TrainerData = Conversion(Trainer);
        TrainerData.push(ActiveTrainer);
        await TrainerData.map(async (singleTrainer) => {
          await HorseTrainerComboModel.create({
            HorseModelId: data._id,
            TrainerModelId: singleTrainer,
          });
        });
      }

      // if (Jockey) {
      //   let JockeyData = Conversion(Jockey);
      //   console.log(JockeyData);
      //   await JockeyData.map(async (singleJockey) => {
      //     await HorseJockeyComboModel.create({
      //       HorseModelId: data._id,
      //       JockeyModelId: singleJockey,
      //     });
      //   });
      // }
    } else {
      return next(new HandlerCallBack("Horse creation failed", 401));
    }
    res.status(200).json({
      success: true,
      data,
    });
  } else {
    return next(
      new HandlerCallBack("Please Fill Data To appropiate fields", 404)
    );
  }
});
// const updateddata = await HorseModel.create({
//   HorseImage: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Horse}/${data.HorseImage}`,
//   NameEn: NameEn || data.NameEn,
//   Age: Age || data.Age,
//   NameAr: NameAr || data.NameAr,
//   Breeder: Breeder || data.Breeder,
//   Remarks: Remarks || data.Remarks,
//   HorseRating: HorseRating || data.HorseRating,
//   Sex: Sex || data.Sex,
//   Color: Color || data.Color,
//   KindOfHorse: KindOfHorse || data.KindOfHorse,
//   Dam: Dam || data.Dam,
//   Sire: Sire || data.Sire,
//   GSire: GSire || data.GSire,
//   Earning: Earning || data.Earning,
//   OverAllRating: OverAllRating || data.OverAllRating,
// });
exports.UpdateHorse = Trackerror(async (req, res, next) => {
  const {
    Age,
    NameEn,
    NameAr,
    Breeder,
    Remarks,
    HorseRating,
    Sex,
    Color,
    KindOfHorse,
    Dam,
    Sire,
    GSire,
    Earning,
    OverAllRating,
    Foal,
    PurchasePrice,
    Cap,
    Rds,
    ColorID,
  } = req.body;
  let data = await HorseModel.findOne({
    where: { _id: req.params.id },
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  if (req.files == null) {
    const updateddata = await HorseModel.create({
      HorseImage: data.HorseImage,
      NameEn: NameEn || data.NameEn,
      Age: Age || data.Age,
      NameAr: NameAr || data.NameAr,
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
      OverAllRating: OverAllRating || data.OverAllRating,
      Foal: Foal || data.Foal,
      PurchasePrice: PurchasePrice || data.PurchasePrice,
      Cap: Cap || data.Cap,
      Rds: Rds || data.Rds,
      ColorID: ColorID || data.ColorID,
    });
    data = await HorseModel.update(updateddata, {
      where: {
        _id: req.params.id,
      },
    });
    res.status(200).json({
      success: true,
      data,
    });
  } else {
    const file = req.files.Horseimage;
    await deleteFile(`${Horse}/${data.Horseimage}`);
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(
      req.files.Horseimage.data,
      214,
      212
    );
    await uploadFile(fileBuffer, `${Horse}/${Image}`, file.mimetype);
    const updateddata = await HorseModel.create({
      HorseImage: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Horse}/${data.HorseImage}`,
      NameEn: NameEn || data.NameEn,
      Age: Age || data.Age,
      NameAr: NameAr || data.NameAr,
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
      OverAllRating: OverAllRating || data.OverAllRating,
      Foal: Foal || data.Foal,
      PurchasePrice: PurchasePrice || data.PurchasePrice,
      Cap: Cap || data.Cap,
      Rds: Rds || data.Rds,
      ColorID: ColorID || data.ColorID,
    });
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
exports.DeleteHorse = Trackerror(async (req, res, next) => {
  const data = await HorseModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);
  await deleteFile(`${Horse}/${data.HorseImage.slice(-64)}`);
  await HorseModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteHorse = Trackerror(async (req, res, next) => {
  const data = await HorseModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);
  await deleteFile(`${Horse}/${data.HorseImage.slice(-64)}`);
  await HorseModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
