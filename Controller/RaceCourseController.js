// const RaceCourseModel = require("../Models/RaceCourseModel");
const db = require("../config/Connection");
const RaceCourseModel = db.RaceCourseModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const Features = require("../Utils/Features");
const { RaceCourse } = require("../Utils/Path");
const { uploadFile, deleteFile } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
exports.GetCourse = Trackerror(async (req, res, next) => {
  const data = await RaceCourseModel.findAll({
    include: [
      { model: db.NationalityModel, as: "NationalityDataRaceCourse" },
      {
        model: db.ColorModel,
        as: "ColorCodeData",
      },
      { model: db.RaceModel, as: "RaceCourseData", include: { all: true } },
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
exports.CreateRaceCourse = Trackerror(async (req, res, next) => {
  const { TrackNameAr, TrackNameEn, shortCode, NationalityID, ColorCode } =
    req.body;
  try {
    const file = req.files.image;
    let Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${RaceCourse}/${Image}`, file.mimetype);
    const data = await RaceCourseModel.create({
      image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${RaceCourse}/${Image}`,
      TrackNameAr: TrackNameAr,
      TrackNameEn: TrackNameEn,
      ColorCode: ColorCode,
      NationalityID: NationalityID,
      shortCode: shortCode,
    });
    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(403);
      res.send({ status: "error", message: "short code already exists" });
    } else {
      res.status(500);
      res.send({ status: "error", message: "Something went wrong" });
    }
  }
});
exports.UpdateCourse = Trackerror(async (req, res, next) => {
  const { TrackNameAr, TrackNameEn, shortCode, NationalityID, ColorCode } =
    req.body;
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
      res.send({ status: "error", message: "short code already exists" });
    } else {
      res.status(500);
      res.send({ status: "error", message: "Something went wrong" });
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
