const db = require("../config/Connection");
const JockeyModel = db.JockeyModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { Jockey } = require("../Utils/Path");
const { uploadFile, deleteFile } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const Features = require("../Utils/Features");
exports.CreateJockey = Trackerror(async (req, res, next) => {
  const {
    NameEn,
    NameAr,
    ShortNameEn,
    ShortNameAr,
    Age,
    MiniumumJockeyWeight,
    JockeyAllowance,
    Rating,
    DOB,
  } = req.body;
  const file = req.files.image;
  const Image = generateFileName();
  const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
  await uploadFile(fileBuffer, `${Jockey}/${Image}`, file.mimetype);
  if (!Name || !Age || !Rating) {
    return next(
      new HandlerCallBack("Please Fill Appropiate Detail Of Trainer", 404)
    );
  } else {
    const data = await JockeyModel.create({
      image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Jockey}/${Image}`,
      NameEn: NameEn,
      NameAr: NameAr,
      ShortNameEn: ShortNameEn,
      ShortNameAr: ShortNameAr,
      MiniumumJockeyWeight: MiniumumJockeyWeight,
      JockeyAllowance: JockeyAllowance,
      DOB: DOB,
      Age: Age,
      Rating: Rating,
    });
    res.status(201).json({
      success: true,
      data,
    });
  }
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
exports.GetJockey = Trackerror(async (req, res, next) => {
  const data = await JockeyModel.findAll();
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
    Age,
    MiniumumJockeyWeight,
    JockeyAllowance,
    Rating,
    DOB,
  } = req.body;
  console.log(req.body);
  // if ((Age = "")) {
  //   Age = null;
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
      DOB: DOB || data.DOB,
      JockeyAllowance: JockeyAllowance || data.JockeyAllowance,
      Age: Age || data.Age,
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
      DOB: DOB || data.DOB,
      JockeyAllowance: JockeyAllowance || data.JockeyAllowance,
      Age: Age || data.Age,
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
  await deleteFile(`${Jockey}/${data.image.slice(-64)}`);
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
  await deleteFile(`${Jockey}/${data.image.slice(-64)}`);
  await JockeyModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
