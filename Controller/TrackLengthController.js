const db = require("../config/Connection");
const TrackLengthModel = db.TrackLengthModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const { uploadFile, deleteFile } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const { TrackLength } = require("../Utils/Path");
exports.CreateTrackLength = Trackerror(async (req, res, next) => {
  const { RaceCourse, TrackLength } = req.body;
  const file = req.files.image;
  const Image = generateFileName();
  const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
  await uploadFile(fileBuffer, `${TrackLength}/${Image}`, file.mimetype);
  const data = await TrackLengthModel.create({
    TrackLength: TrackLength,
    RaceCourseImage: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${TrackLength}/${Image}`,
    RaceCourse: RaceCourse,
  });
  res.status(201).json({
    success: true,
    data,
  });
});
exports.TrackLengthGet = Trackerror(async (req, res, next) => {
  const data = await TrackLengthModel.findAll({ include: { all: true } });
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.GetTrackLengthAdmin = Trackerror(async (req, res, next) => {});
exports.EditTrackLength = Trackerror(async (req, res, next) => {
  // const { NameEn, NameAr, shortCode } = req.body;
  // let data = await TrackLengthModel.findOne({
  //   where: { _id: req.params.id },
  // });
  // if (data === null) {
  //   return next(new HandlerCallBack("data not found", 404));
  // }
  // const updateddata = {
  //   shortCode: shortCode || data.shortCode,
  //   NameEn: NameEn || data.NameEn,
  //   NameAr: NameAr || data.NameAr,
  // };
  // data = await TrackLengthModel.update(updateddata, {
  //   where: {
  //     _id: req.params.id,
  //   },
  // });
  // res.status(200).json({
  //   success: true,
  //   data,
  // });
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
