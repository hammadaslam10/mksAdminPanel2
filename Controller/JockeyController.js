const db = require("../config/Connection");
const JockeyModel = db.JockeyModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { Jockey, Breeder } = require("../Utils/Path");
const { uploadFile, deleteFile } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const Features = require("../Utils/Features");
const { Op } = require("sequelize");
exports.GetDeletedJockey = Trackerror(async (req, res, next) => {
  const data = await JockeyModel.findAll({
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
exports.RestoreSoftDeletedJockey = Trackerror(async (req, res, next) => {
  const data = await JockeyModel.findOne({
    paranoid: false,
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const restoredata = await JockeyModel.restore({
    where: { _id: req.params.id },
  });
  res.status(200).json({
    success: true,
    restoredata,
  });
});

exports.CreateJockey = Trackerror(async (req, res, next) => {
  const {
    NameEn,
    NameAr,
    RemarksEn,
    RemarksAr,
    Rating,
    ShortNameEn,
    ShortNameAr,
    NationalityID,
    MiniumumJockeyWeight,
    MaximumJockeyWeight,
    JockeyAllowance,
    DOB,
    JockeyLicenseDate,
  } = req.body;
  if (req.files == null) {
    try {
      const data = await JockeyModel.create({
        NameEn: NameEn,
        NameAr: NameAr,
        ShortNameEn: ShortNameEn,
        ShortNameAr: ShortNameAr,
        MiniumumJockeyWeight: MiniumumJockeyWeight,
        MaximumJockeyWeight: MaximumJockeyWeight,
        JockeyAllowance: JockeyAllowance,
        DOB: DOB,
        NationalityID: NationalityID,
        RemarksEn: RemarksEn,
        RemarksAr: RemarksAr,
        JockeyLicenseDate: JockeyLicenseDate,
        Rating: Rating,
      });
      res.status(201).json({
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
  await uploadFile(fileBuffer, `${Jockey}/${Image}`, file.mimetype);
  const data = await JockeyModel.create({
    image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Jockey}/${Image}`,
    NameEn: NameEn,
    NameAr: NameAr,
    ShortNameEn: ShortNameEn,
    ShortNameAr: ShortNameAr,
    MiniumumJockeyWeight: MiniumumJockeyWeight,
    MaximumJockeyWeight: MaximumJockeyWeight,
    JockeyAllowance: JockeyAllowance,
    DOB: DOB,
    NationalityID: NationalityID,
    RemarksEn: RemarksEn,
    RemarksAr: RemarksAr,
    JockeyLicenseDate: JockeyLicenseDate,
    Rating: Rating,
  });
  res.status(201).json({
    success: true,
    data,
  });
});
exports.SingleJockey = Trackerror(async (req, res, next) => {
  const data = await JockeyModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("Jockey is not available", 404));
  } else {
    res.status(200).json({
      success: true,
      data,
    });
  }
});
exports.SearchJockey = Trackerror(async (req, res, next) => {
  const totalcount = await JockeyModel.count();
  const data = await JockeyModel.findAll({
    offset: Number(req.query.page) - 1 || 0,
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
      Rating: {
        [Op.like]: `%${req.query.Rating || ""}%`,
      },
      NationalityID: {
        [Op.like]: `%${req.query.NationalityID || ""}%`,
      },
      RemarksEn: {
        [Op.like]: `%${req.query.RemarksEn || ""}%`,
      },
      RemarksAr: {
        [Op.like]: `%${req.query.RemarksAr || ""}%`,
      },
      // MiniumumJockeyWeight: {
      //   [Op.like]: `%${req.query.MiniumumJockeyWeight || ""}%`,
      // },
      // MaximumJockeyWeight: {
      //   [Op.like]: `%${req.query.MaximumJockeyWeight || ""}%`,
      // },
      // JockeyAllowance: {
      //   [Op.like]: `%${req.query.JockeyAllowance || ""}%`,
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
exports.GetJockey = Trackerror(async (req, res, next) => {
  const data = await JockeyModel.findAll({
    include: { all: true },
  });
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.GetJockeyforRace = Trackerror(async (req, res, next) => {
  const { Jockeyids, JockeyName } = req.body;
  const data = await JockeyModel.findAll({
    where: {
      [Op.and]: [
        {
          _id: {
            [Op.ne]: Jockeyids,
          },
        },
        {
          NameEn: {
            [Op.like]: `%${JockeyName}%`,
          },
          NameAr: {
            [Op.like]: `%${JockeyName}%`,
          },
        },
      ],
    },
  });
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.EditJockey = Trackerror(async (req, res, next) => {
  const {
    NameEn,
    NameAr,
    ShortNameEn,
    ShortNameAr,
    NationalityID,
    MiniumumJockeyWeight,
    JockeyAllowance,
    MaximumJockeyWeight,
    Rating,
    DOB,
    JockeyLicenseDate,
  } = req.body;
  console.log(req.body);
  // if ((NationalityID = "")) {
  //   NationalityID = null;
  // }
  // if ((Rating = "")) {
  //   Rating = null;
  // }
  let data = await JockeyModel.findOne({
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
      MiniumumJockeyWeight: MiniumumJockeyWeight || data.MiniumumJockeyWeight,
      MaximumJockeyWeight: MaximumJockeyWeight || data.MaximumJockeyWeight,
      DOB: DOB || data.DOB,
      JockeyAllowance: JockeyAllowance || data.JockeyAllowance,
      NationalityID: NationalityID || data.NationalityID,
      Rating: Rating || data.Rating,
      JockeyLicenseDate: JockeyLicenseDate || data.JockeyLicenseDate,
    };
    data = await JockeyModel.update(updateddata, {
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
    await deleteFile(`${Jockey}/${data.image}`);
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${Jockey}/${Image}`, file.mimetype);

    const updateddata = {
      image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Jockey}/${Image}`,
      NameEn: NameEn || data.NameEn,
      NameAr: NameAr || data.NameAr,
      ShortNameEn: ShortNameEn || data.ShortNameEn,
      ShortNameAr: ShortNameAr || data.ShortNameAr,
      MiniumumJockeyWeight: MiniumumJockeyWeight || data.MiniumumJockeyWeight,
      MaximumJockeyWeight: MaximumJockeyWeight || data.MaximumJockeyWeight,
      DOB: DOB || data.DOB,
      JockeyAllowance: JockeyAllowance || data.JockeyAllowance,
      NationalityID: NationalityID || data.NationalityID,
      Rating: Rating || data.Rating,
    };

    data = await JockeyModel.update(updateddata, {
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
exports.DeleteJockey = Trackerror(async (req, res, next) => {
  const data = await JockeyModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);

  await JockeyModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteJockey = Trackerror(async (req, res, next) => {
  const data = await JockeyModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);

  await JockeyModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
