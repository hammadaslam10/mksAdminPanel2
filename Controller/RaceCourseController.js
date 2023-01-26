// const RaceCourseModel = require("../Models/RaceCourseModel");
const db = require("../config/Connection");
const RaceCourseModel = db.RaceCourseModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const Features = require("../Utils/Features");
const { RaceCourse, Breeder } = require("../Utils/Path");
const { uploadFile, deleteFile } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const { Op } = require("sequelize");
exports.GetDeletedRaceCourse = Trackerror(async (req, res, next) => {
  const data = await RaceCourseModel.findAll({
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
exports.RestoreSoftDeletedRaceCourse = Trackerror(async (req, res, next) => {
  const data = await RaceCourseModel.findOne({
    paranoid: false,
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const restoredata = await RaceCourseModel.restore({
    where: { _id: req.params.id },
  });
  res.status(200).json({
    success: true,
    restoredata,
  });
});

exports.GetCourse = Trackerror(async (req, res, next) => {
  const data = await RaceCourseModel.findAll({
    include: [
      {
        model: db.NationalityModel,
        as: "NationalityDataRaceCourse",
        paranoid: false,
      },
      {
        model: db.ColorModel,
        as: "ColorCodeData",
      },
      {
        model: db.RaceModel,
        as: "RaceCourseData",
        include: { all: true },
      },
    ],
  });
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.SingleRaceCourse = Trackerror(async (req, res, next) => {
  const data = await RaceCourseModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return new next("horse is not available", 404);
  } else {
    res.status(200).json({
      success: true,
      data,
    });
  }
});
exports.SearchRaceCourse = Trackerror(async (req, res, next) => {
  const totalcount = await RaceCourseModel.count();
  const data = await RaceCourseModel.findAll({
    offset: Number(req.query.page) - 1 || 0,
    limit: Number(req.query.limit) || 10,
    order: [[req.query.orderby || "createdAt", req.query.sequence || "ASC"]],
    include: { all: true },
    where: {
      TrackNameEn: {
        [Op.like]: `%${req.query.TrackNameEn || ""}%`,
      },
      TrackNameAr: {
        [Op.like]: `%${req.query.TrackNameAr || ""}%`,
      },
      shortCode: {
        [Op.like]: `%${req.query.shortCode || ""}%`,
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
    totalcount,
    filtered: data.length,
  });
});
exports.CreateRaceCourse = Trackerror(async (req, res, next) => {
  const {
    TrackNameAr,
    TrackNameEn,
    shortCode,
    NationalityID,
    ColorCode,
    AbbrevAr,
    AbbrevEn,
  } = req.body;

  if (req.files === null) {
    try {
      const data = await RaceCourseModel.create({
        TrackNameAr: TrackNameAr,
        TrackNameEn: TrackNameEn,
        ColorCode: ColorCode,
        NationalityID: NationalityID,
        shortCode: shortCode,
        AbbrevAr: AbbrevAr,
        AbbrevEn: AbbrevEn,
      });
      res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        res.status(403);
        res.json({
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
  } else {
    try {
      const file = req.files.image;
      let Image = generateFileName();
      const fileBuffer = await resizeImageBuffer(
        req.files.image.data,
        214,
        212
      );
      await uploadFile(fileBuffer, `${RaceCourse}/${Image}`, file.mimetype);
      const data = await RaceCourseModel.create({
        image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${RaceCourse}/${Image}`,
        TrackNameAr: TrackNameAr,
        TrackNameEn: TrackNameEn,
        ColorCode: ColorCode,
        NationalityID: NationalityID,
        shortCode: shortCode,
        AbbrevAr: AbbrevAr,
        AbbrevEn: AbbrevEn,
      });
      res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        res.status(403);
        res.json({
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
});
exports.UpdateCourse = Trackerror(async (req, res, next) => {
  const {
    TrackNameAr,
    TrackNameEn,
    shortCode,
    NationalityID,
    ColorCode,
    AbbrevAr,
    AbbrevEn,
  } = req.body;
  let data = await RaceCourseModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  try {
    const updateddata = {
      shortCode: shortCode || data.shortCode,
      TrackNameAr: TrackNameAr || data.TrackNameAr,
      TrackNameEn: TrackNameEn || data.TrackNameEn,
      ColorCode: ColorCode || data.ColorCode,
      NationalityID: NationalityID || data.NationalityID,
      AbbrevAr: AbbrevAr || data.AbbrevAr,
      AbbrevEn: AbbrevEn || data.AbbrevEn,
    };
    data = await RaceCourseModel.update(updateddata, {
      where: {
        _id: req.params.id,
      },
    });
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(403);
      res.json({
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
});
exports.DeleteCourse = Trackerror(async (req, res, next) => {
  const data = await RaceCourseModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);
  await RaceCourseModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  await deleteFile(`${RaceCourse}/${data.image.slice(-64)}`);
  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteCourse = Trackerror(async (req, res, next) => {
  const data = await RaceCourseModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);
  await RaceCourseModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
