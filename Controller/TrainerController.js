const db = require("../config/Connection");
const TrainerModel = db.TrainerModel
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { Trainer } = require("../Utils/Path");
const { uploadFile, deleteFile, getObjectSignedUrl } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const Features = require("../Utils/Features");
exports.GetTrainer = Trackerror(async (req, res, next) => {
  const data = await TrainerModel.findAll();
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.CreateTrainer = Trackerror(async (req, res, next) => {
  const { Name, Age, Detail, Remarks } = req.body;
  const file = req.files.image;
  const Image = generateFileName();
  const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
  await uploadFile(fileBuffer, `${Trainer}/${Image}`, file.mimetype);

  const data = await TrainerModel.create({
    image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Trainer}/${Image}`,
    Name: Name,
    Age: Age,
    Detail: Detail,
    Remarks: Remarks,
  });

  res.status(201).json({
    success: true,
    data,
  });
});
exports.UpdateTrainer = Trackerror(async (req, res, next) => {
  const { Name, Age, Detail, Remarks } = req.body;
  let data = await TrainerModel.findOne({
    where: { _id: req.params.id },
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  if (req.files == null) {
    data = await TrainerModel.update(req.body, {
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
      Name: Name || data.Name,
      Age: Age || data.Age,
      Detail: Detail || data.Detail,
      Remarks: Remarks || data.Remarks,
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
  await deleteFile(`${Ads}/${data.image.slice(-64)}`);
  await TrainerModel.destroy({
    where: { _id: req.params.id },
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
  await deleteFile(`${Ads}/${data.image.slice(-64)}`);
  await TrainerModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
// aws dax cluster on nodejs ?
