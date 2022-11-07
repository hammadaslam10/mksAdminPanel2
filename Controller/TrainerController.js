const db = require("../config/Connection");
const TrainerModel = db.TrainerModel;
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
  const {
    NameEn,
    NameAr,
    TitleEn,
    TitleAr,
    DOB,
    TrainerLicenseDate,
    ShortNameEn,
    ShortNameAr,
    Age,
    Detail,
    Remarks,
  } = req.body;
  const file = req.files.image;
  const Image = generateFileName();
  const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
  await uploadFile(fileBuffer, `${Trainer}/${Image}`, file.mimetype);
  if (!Name || !Age || !Detail || !Remarks) {
    return next(
      new HandlerCallBack("Please Fill Appropiate Detail Of Trainer", 404)
    );
  } else {
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
      Age: Age,
      Detail: Detail,
      Remarks: Remarks,
    });

    res.status(201).json({
      success: true,
      data,
    });
  }
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
    Age,
    Detail,
    Remarks,
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
  await deleteFile(`${Trainer}/${data.image.slice(-64)}`);
  await TrainerModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
