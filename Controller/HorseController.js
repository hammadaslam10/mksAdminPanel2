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
const { Op, Sequelize } = require("sequelize");
exports.GetDeletedHorse = Trackerror(async (req, res, next) => {
  const data = await HorseModel.findAll({
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
exports.RestoreSoftDeletedHorse = Trackerror(async (req, res, next) => {
  const data = await HorseModel.findOne({
    paranoid: false,
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const restoredata = await HorseModel.restore({
    where: { _id: req.params.id },
  });
  res.status(200).json({
    success: true,
    restoredata,
  });
});

exports.SearchName = Trackerror(async (req, res, next) => {
  const { Query } = req.body;
  console.log(Query);
  const data1 = await HorseModel.findAll({
    where: {
      NameEn: {
        [Op.like]: `%${Query}%`,
      },
    },
    include: { all: true },
  });
  const data2 = await TrainerModel.findAll({
    where: {
      NameEn: {
        [Op.like]: `%${Query}%`,
      },
    },
    include: { all: true },
  });
  const data3 = await OwnerModel.findAll({
    where: {
      NameEn: {
        [Op.like]: `%${Query}%`,
      },
    },
    include: { all: true },
  });
  res.status(200).json({
    success: true,
    data1,
    data2,
    data3,
  });
});
exports.PedigreeHorse = Trackerror(async (req, res, next) => {
  const [results, metadata] = await db.sequelize.query(
    `with recursive cte (Dam,Sire, shortCode, _id) as (
      select     Dam,  Sire,
                 shortCode,
                 _id
      from       mksracing.HorseModel
      where      _id = '${"7847c435-6af0-411b-ab7a-3ee008cdf1aa"}'
      union all
      select     p.Dam,
                 p.Sire,
                 p.shortCode,
                 p._id
      from       HorseModel p
      inner join cte
              on p._id = cte.Dam
    )
    select * from cte;`
  );
  res.status(200).json({
    success: true,
    results,
  });
});
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
    STARS,
    CreationId,
    NameEn,
    DOB,
    NameAr,
    Owner,
    ActiveTrainer,
    Breeder,
    Trainer,
    Sex,
    Color,
    Earning,
    History,
    ActiveOwner,
    NationalityID,
    Foal,
    PurchasePrice,
    Cap,
    Rds,
    ColorID,
    HorseStatus,
    Dam,
    Sire,
    GSire,
    Height,
    KindHorse,
    shortCode,
    RemarksAr,
    RemarksEn,
  } = req.body;
  const file = req.files.image;
  if (file == null) {
    return next(new HandlerCallBack("Please upload an image", 404));
  }
  const Image = generateFileName();
  const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
  await uploadFile(fileBuffer, `${Horse}/${Image}`, file.mimetype);
  const data = await HorseModel.create({
    HorseImage: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Horse}/${Image}`,
    NameEn: NameEn,
    DOB: DOB,
    NameAr: NameAr,
    ActiveTrainer: ActiveTrainer,
    Breeder: Breeder,
    RemarksEn: RemarksEn,
    Sex: Sex,
    Color: Color,
    Earning: Earning,
    History: History,
    STARS: STARS,
    ActiveOwner: ActiveOwner,
    NationalityID: NationalityID,
    Foal: Foal,
    PurchasePrice: PurchasePrice,
    Cap: Cap,
    Rds: Rds,
    ColorID: ColorID,
    CreationId: CreationId,
    HorseStatus: HorseStatus,
    Dam: Dam || null,
    Sire: Sire || null,
    GSire: GSire || null,
    Height: Height,
    KindHorse: KindHorse,
    shortCode: shortCode,
    RemarksAr: RemarksAr,
  });

  if (data._id) {
    if (Owner) {
      let OwnerData = Conversion(Owner);
      // OwnerData.push(ActiveOwner);
      await OwnerData.map(async (singleOwner) => {
        await HorseOwnerComboModel.create({
          HorseModelId: data._id,
          OwnerModelId: singleOwner,
        });
      });
    }

    if (Trainer) {
      let TrainerData = Conversion(Trainer);
      // TrainerData.push(ActiveTrainer);
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
    res.status(200).json({
      success: true,
      data,
    });
  } else {
    return next(new HandlerCallBack("Error Occured", 404));
  }
});
exports.UpdateHorse = Trackerror(async (req, res, next) => {
  const {
    NameEn,
    DOB,
    NameAr,
    Breeder,
    RemarksEn,
    HorseRating,
    Sex,
    Color,
    RemarksAr,
    KindOfHorse,
    Dam,
    Sire,
    GSire,
    Earning,
    Foal,
    PurchasePrice,
    Cap,
    Rds,
    ColorID,
    NationalityID,
    CreationId,
    Height,
    KindHorse,
    ActiveTrainer,
    STARS,
    shortCode,
  } = req.body;
  let data = await HorseModel.findOne({
    where: { _id: req.params.id },
  });

  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  if (req.files == null) {
    const updateddata = {
      HorseImage: data.HorseImage,
      NameEn: NameEn || data.NameEn,
      DOB: DOB || data.DOB,
      NameAr: NameAr || data.NameAr,
      Breeder: Breeder || data.Breeder,
      RemarksEn: RemarksEn || data.RemarksEn,
      RemarksAr: RemarksAr || data.RemarksAr,
      HorseRating: HorseRating || data.HorseRating,
      Sex: Sex || data.Sex,
      Color: Color || data.Color,
      KindOfHorse: KindOfHorse || data.KindOfHorse,
      Dam: Dam || data.Dam,
      Sire: Sire || data.Sire,
      GSire: GSire || data.GSire,
      Earning: Earning || data.Earning,
      Foal: Foal || data.Foal,
      PurchasePrice: PurchasePrice || data.PurchasePrice,
      Cap: Cap || data.Cap,
      Rds: Rds || data.Rds,
      ColorID: ColorID || data.ColorID,
      CreationId: CreationId || data.CreationId,
      Height: Height || data.Height,
      NationalityID: NationalityID || data.NationalityID,
      KindHorse: KindHorse || data.KindHorse,
      ActiveTrainer: ActiveTrainer || data.ActiveTrainer,
      STARS: STARS || data.STARS,
      shortCode: shortCode || data.shortCode,
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
    const updateddata = {
      HorseImage: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Horse}/${Image}`,
      NameEn: NameEn || data.NameEn,
      NameEn: NameEn || data.NameEn,
      NameEn: NameEn || data.NameEn,
      DOB: DOB || data.DOB,
      NameAr: NameAr || data.NameAr,
      Breeder: Breeder || data.Breeder,
      RemarksEn: RemarksEn || data.RemarksEn,
      HorseRating: HorseRating || data.HorseRating,
      Sex: Sex || data.Sex,
      Color: Color || data.Color,
      KindOfHorse: KindOfHorse || data.KindOfHorse,
      Dam: Dam || data.Dam,
      Sire: Sire || data.Sire,
      GSire: GSire || data.GSire,
      Earning: Earning || data.Earning,
      Foal: Foal || data.Foal,
      PurchasePrice: PurchasePrice || data.PurchasePrice,
      Cap: Cap || data.Cap,
      Rds: Rds || data.Rds,
      ColorID: ColorID || data.ColorID,
      NationalityID: NationalityID || data.NationalityID,
      CreationId: CreationId || data.CreationId,
      Height: Height || data.Height,
      KindHorse: KindHorse || data.KindHorse,
      ActiveTrainer: ActiveTrainer || data.ActiveTrainer,
      shortCode: shortCode || data.shortCode,
      RemarksAr: RemarksAr || data.RemarksAr,
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
