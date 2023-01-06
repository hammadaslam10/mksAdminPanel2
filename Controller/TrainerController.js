const db = require("../config/Connection");
const TrainerModel = db.TrainerModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { Trainer, Breeder } = require("../Utils/Path");
const { uploadFile, deleteFile, getObjectSignedUrl } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const Features = require("../Utils/Features");
const { Op } = require("sequelize");
exports.GetDeletedTrainer = Trackerror(async (req, res, next) => {
  const data = await TrainerModel.findAll({
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
exports.RestoreSoftDeletedTrainer = Trackerror(async (req, res, next) => {
  const data = await TrainerModel.findOne({
    paranoid: false,
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const restoredata = await TrainerModel.restore({
    where: { _id: req.params.id },
  });
  res.status(200).json({
    success: true,
    restoredata,
  });
});
exports.SearchTrainer = Trackerror(async (req, res, next) => {
  const data = await TrainerModel.findAll({
    offset: Number(req.query.page) || 0,
    limit: Number(req.query.limit) || 10,
    order: [[req.query.orderby || "createdAt", req.query.sequence || "ASC"]],
    include: { all: true },
    where: {
      NameEn: {
        [Op.like]: `%${req.query.NameEn || ""}%`,
      },
      NameAr: {
        [Op.like]: `%${req.query.NameAr || ""}%`,
      },
      ShortNameEn: {
        [Op.like]: `%${req.query.ShortNameEn || ""}%`,
      },
      ShortNameAr: {
        [Op.like]: `%${req.query.ShortNameAr || ""}%`,
      },
      DetailEn: {
        [Op.like]: `%${req.query.DetailEn || ""}%`,
      },
      RemarksEn: {
        [Op.like]: `%${req.query.RemarksEn || ""}%`,
      },
      RemarksAr: {
        [Op.like]: `%${req.query.RemarksAr || ""}%`,
      },
      DetailAr: {
        [Op.like]: `%${req.query.DetailAr || ""}%`,
      },
      TitleEn: {
        [Op.like]: `%${req.query.TitleEn || ""}%`,
      },
      TitleAr: {
        [Op.like]: `%${req.query.TitleAr || ""}%`,
      },
      // DOB: {
      //   [Op.like]: `%${req.query.DOB || ""}%`,
      // },
      NationalityID: {
        [Op.like]: `%${req.query.NationalityID || ""}%`,
      },
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
  });
});
exports.GetTrainer = Trackerror(async (req, res, next) => {
  const data = await TrainerModel.findAll({
    include: { all: true },
  });
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.CreateTrainer = Trackerror(async (req, res, next) => {
  const {
    NameEn,
    NameAr,
    TitleEn,
    TitleAr,
    DOB,
    TrainerLicenseDate,
    ShortNameEn,
    ShortNameAr,
    DetailEn,
    RemarksEn,
    NationalityID,
    Rating,
    DetailAr,
    RemarksAr,
  } = req.body;
  if (req.files === null) {
    try {
      const data = await TrainerModel.create({
        NameEn: NameEn,
        NameAr: NameAr,
        ShortNameEn: ShortNameEn,
        ShortNameAr: ShortNameAr,
        TitleEn: TitleEn,
        TitleAr: TitleAr,
        TrainerLicenseDate: TrainerLicenseDate,
        DOB: DOB,
        DetailEn: DetailEn,
        RemarksEn: RemarksEn,
        Rating: Rating,
        NationalityID: NationalityID,
        DetailAr: DetailAr,
        RemarksAr: RemarksAr,
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
  }
  const file = req.files.image;
  const Image = generateFileName();
  const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
  await uploadFile(fileBuffer, `${Trainer}/${Image}`, file.mimetype);

  const data = await TrainerModel.create({
    image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Trainer}/${Image}`,
    NameEn: NameEn,
    NameAr: NameAr,
    ShortNameEn: ShortNameEn,
    ShortNameAr: ShortNameAr,
    TitleEn: TitleEn,
    TitleAr: TitleAr,
    TrainerLicenseDate: TrainerLicenseDate,
    DOB: DOB,
    DetailEn: DetailEn,
    RemarksEn: RemarksEn,
    Rating: Rating,
    NationalityID: NationalityID,
    DetailAr: DetailAr,
    RemarksAr: RemarksAr,
  });

  res.status(201).json({
    success: true,
    data,
  });
});
exports.UpdateTrainer = Trackerror(async (req, res, next) => {
  const {
    NameEn,
    NameAr,
    TitleEn,
    TitleAr,
    DOB,
    TrainerLicenseDate,
    ShortNameEn,
    ShortNameAr,
    DetailEn,
    RemarksEn,
    Rating,
    NationalityID,
    DetailAr,
    RemarksAr,
  } = req.body;
  let data = await TrainerModel.findOne({
    where: { _id: req.params.id },
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  if (req.files == null) {
    const updateddata = {
      image: data.image,
      NameEn: NameEn || data.NameEn,
      NameAr: NameAr || data.NameAr,
      ShortNameEn: ShortNameEn || data.ShortNameEn,
      ShortNameAr: ShortNameAr || data.ShortNameAr,
      TitleEn: TitleEn || data.TitleEn,
      TitleAr: TitleAr || data.TitleAr,
      TrainerLicenseDate: TrainerLicenseDate || data.TrainerLicenseDate,
      DOB: DOB || data.DOB,
      DetailEn: DetailEn || data.DetailEn,
      RemarksEn: RemarksEn || data.RemarksEn,
      Rating: Rating || data.Rating,
      NationalityID: NationalityID || data.NationalityID,
      DetailAr: DetailAr || data.DetailAr,
      RemarksAr: RemarksAr || data.RemarksAr,
    };
    data = await TrainerModel.update(updateddata, {
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
    await deleteFile(`${Trainer}/${data.image}`);
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${Trainer}/${Image}`, file.mimetype);

    const updateddata = {
      image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Trainer}/${Image}`,
      NameEn: NameEn || data.NameEn,
      NameAr: NameAr || data.NameAr,
      ShortNameEn: ShortNameEn || data.ShortNameEn,
      ShortNameAr: ShortNameAr || data.ShortNameAr,
      TitleEn: TitleEn || data.TitleEn,
      TitleAr: TitleAr || data.TitleAr,
      TrainerLicenseDate: TrainerLicenseDate || data.TrainerLicenseDate,
      DOB: DOB || data.DOB,
      DetailEn: DetailEn || data.DetailEn,
      RemarksEn: RemarksEn || data.RemarksEn,
      Rating: Rating || data.Rating,
      RemarksAr: RemarksAr || data.RemarksAr,
    };
    data = await TrainerModel.update(updateddata, {
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
exports.SingleTrainer = Trackerror(async (req, res, next) => {
  let data = await TrainerModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return new next("Trainer is not available", 404);
  } else {
    res.status(200).json({
      success: true,
      data,
    });
  }
});
exports.DeleteTrainer = Trackerror(async (req, res, next) => {
  const data = await TrainerModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);
  await deleteFile(`${Trainer}/${data.image.slice(-64)}`);
  await TrainerModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteTrainer = Trackerror(async (req, res, next) => {
  const data = await TrainerModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);
  await TrainerModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
