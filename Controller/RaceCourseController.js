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
  const data = await RaceCourseModel.findAll();
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
  const {
    Country,
    TrackName,
    TrackLength,
    WeatherType,
    WeatherDegree,
    WeatherIcon,
  } = req.body;
  const file = req.files.image;
  let Image = generateFileName();
  const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
  await uploadFile(fileBuffer, `${RaceCourse}/${Image}`, file.mimetype);
  const data = await RaceCourseModel.create({
    image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${RaceCourse}/${Image}`,
    Country: Country,
    TrackName: TrackName,
    TrackLength: TrackLength,
    WeatherType: WeatherType,
    WeatherDegree: WeatherDegree,
    WeatherIcon: WeatherIcon,
  });
  res.status(201).json({
    success: true,
    data,
  });
});
exports.UpdateCourse = Trackerror(async (req, res, next) => {
  const {
    Country,
    TrackName,
    TrackLength,
    WeatherType,
    WeatherDegree,
    WeatherIcon,
  } = req.body;
  let data = await RaceCourseModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const updateddata = {
    Country: Country || data.Country,
    TrackName: TrackName || data.TrackName,
    TrackLength: TrackLength || data.TrackLength,
    WeatherType: WeatherType || data.WeatherType,
    WeatherDegree: WeatherDegree || data.WeatherDegree,
    WeatherIcon: WeatherIcon || data.WeatherIcon,
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
});
exports.DeleteCourse = Trackerror(async (req, res, next) => {
  const data = await RaceCourseModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);
  await deleteFile(`${RaceCourse}/${data.image.slice(-64)}`);
  await RaceCourseModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
