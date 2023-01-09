const db = require("../config/Connection");
const TrackLengthModel = db.TrackLengthModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const { uploadFile, deleteFile } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const { TrackLengths, Breeder } = require("../Utils/Path");
const { Op } = require("sequelize");
exports.GetDeletedTrackLength = Trackerror(async (req, res, next) => {
  const data = await TrackLengthModel.findAll({
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
exports.RestoreSoftDeletedTrackLength = Trackerror(async (req, res, next) => {
  const data = await TrackLengthModel.findOne({
    paranoid: false,
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const restoredata = await TrackLengthModel.restore({
    where: { _id: req.params.id },
  });
  res.status(200).json({
    success: true,
    restoredata,
  });
});

exports.CreateTrackLength = Trackerror(async (req, res, next) => {
  const { RaceCourse, TrackLength, RailPosition, GroundType } = req.body;
  if (req.files === null) {
    try {
      const data = await TrackLengthModel.create({
        TrackLength: TrackLength,
        RaceCourse: RaceCourse,
        RailPosition: RailPosition,
        GroundType: GroundType,
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
  } else {
    const file = req.files.image;
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${TrackLength}/${Image}`, file.mimetype);
    const data = await TrackLengthModel.create({
      TrackLength: TrackLength,
      RaceCourseImage: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${TrackLengths}/${Image}`,
      RaceCourse: RaceCourse,
      RailPosition: RailPosition,
      GroundType: GroundType,
    });
    res.status(201).json({
      success: true,
      data,
    });
  }
});
exports.TrackLengthGet = Trackerror(async (req, res, next) => {
  const data = await TrackLengthModel.findAll({
    offset: Number(req.query.page) || 0,
    limit: Number(req.query.limit) || 10,
    order: [[req.query.orderby || "createdAt", req.query.sequence || "ASC"]],
    where: {
      TrackLength: {
        [Op.like]: `%${req.query.TrackLength || ""}%`,
      },
      RaceCourse: {
        [Op.like]: `%${req.query.RaceCourse || ""}%`,
      },
      GroundType: {
        [Op.like]: `%${req.query.GroundType || ""}%`,
      },
      createdAt: {
        [Op.between]: [
          req.query.startdate || "2021-12-01 00:00:00",
          req.query.endDate || "4030-12-01 00:00:00",
        ],
      },
    },
    include: { all: true },
  });
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.GetTrackLengthAdmin = Trackerror(async (req, res, next) => {});
exports.EditTrackLength = Trackerror(async (req, res, next) => {
  const { RaceCourse, TrackLength, RailPosition, GroundType } = req.body;
  let data = await TrackLengthModel.findOne({
    where: { _id: req.params.id },
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const updateddata = {
    RaceCourse: RaceCourse || data.RaceCourse,
    TrackLength: TrackLength || data.TrackLength,
    RailPosition: RailPosition || data.RailPosition,
    GroundType: GroundType || data.GroundType,
  };
  data = await TrackLengthModel.update(updateddata, {
    where: {
      _id: req.params.id,
    },
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.DeleteTrackLength = Trackerror(async (req, res, next) => {
  const data = await TrackLengthModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await TrackLengthModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteTrackLength = Trackerror(async (req, res, next) => {
  const data = await TrackLengthModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await TrackLengthModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "Soft Delete Successfully",
  });
});
