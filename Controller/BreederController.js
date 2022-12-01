const db = require("../config/Connection");
const BreederModel = db.BreederModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { Breeder } = require("../Utils/Path");
const { uploadFile, deleteFile } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const sequelize = require("sequelize");
exports.GetBreederMaxShortCode = Trackerror(async (req, res, next) => {
  const data = await BreederModel.findAll({
    attributes: [
      [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
    ],
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.CreateBreeder = Trackerror(async (req, res, next) => {
  const {
    NameEn,
    NameAr,
    DescriptionEn,
    DescriptionAr,
    TitleEn,
    TitleAr,
    shortCode
  } = req.body;
  const file = req.files.image;
  const Image = generateFileName();
  const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
  await uploadFile(fileBuffer, `${Breeder}/${Image}`, file.mimetype);
  if (
    ArRegex.test(DescriptionAr) &&
    ArRegex.test(NameAr) &&
    ArRegex.test(DescriptionEn) == false &&
    ArRegex.test(NameEn) == false
  ) {
    const data = await BreederModel.create({
      image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Breeder}/${Image}`,
      DescriptionEn: DescriptionEn,
      DescriptionAr: DescriptionAr,
      shortCode: shortCode,
      TitleEn: TitleEn,
      TitleAr: TitleAr,
      NameEn: NameEn,
      NameAr: NameAr
    });
    res.status(201).json({
      success: true,
      data
    });
  } else {
    return next(
      new HandlerCallBack("Please Fill Data To appropiate fields", 404)
    );
  }
});
exports.BreederGet = Trackerror(async (req, res, next) => {
  const data = await BreederModel.findAll();
  res.status(200).json({
    success: true,
    data: data
  });
});
exports.GetBreederAdmin = Trackerror(async (req, res, next) => {});
exports.EditBreeder = Trackerror(async (req, res, next) => {
  const {
    NameEn,
    NameAr,
    DescriptionEn,
    DescriptionAr,
    TitleEn,
    TitleAr,
    shortCode
  } = req.body;
  let data = await BreederModel.findOne({
    where: { _id: req.params.id }
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  if (req.files == null) {
    const updateddata = {
      image: data.image,
      DescriptionEn: DescriptionEn || data.DescriptionEn,
      DescriptionAr: DescriptionAr || data.DescriptionAr,
      shortCode: shortCode || data.shortCode,
      TitleEn: TitleEn || data.TitleEn,
      TitleAr: TitleAr || data.TitleAr,
      NameEn: NameEn || data.NameEn,
      NameAr: NameAr || data.NameAr
    };
    data = await BreederModel.update(updateddata, {
      where: {
        _id: req.params.id
      }
    });
    res.status(200).json({
      success: true,
      data
    });
  } else {
    const file = req.files.image;
    await deleteFile(`${Breeder}/${data.image}`);
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${Breeder}/${Image}`, file.mimetype);
    const updateddata = {
      image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Breeder}/${Image}`,
      DescriptionEn: DescriptionEn || data.DescriptionEn,
      DescriptionAr: DescriptionAr || data.DescriptionAr,
      shortCode: shortCode || data.shortCode,
      TitleEn: TitleEn || data.TitleEn,
      TitleAr: TitleAr || data.TitleAr,
      NameEn: NameEn || data.NameEn,
      NameAr: NameAr || data.NameAr
    };
    data = await BreederModel.update(updateddata, {
      where: {
        _id: req.params.id
      }
    });

    res.status(200).json({
      success: true,
      data
    });
  }
});
exports.SingleBreeder = Trackerror(async (req, res, next) => {
  const data = await BreederModel.findOne({
    where: { _id: req.params.id },
    include: { all: true }
  });
  if (!data) {
    return next(new HandlerCallBack("Race is Not Available", 404));
  } else {
    res.status(200).json({
      success: true,
      data
    });
  }
});
exports.DeleteBreeder = Trackerror(async (req, res, next) => {
  const data = await BreederModel.findOne({
    where: { _id: req.params.id }
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);
  await deleteFile(`${Breeder}/${data.image.slice(-64)}`);
  await BreederModel.destroy({
    where: { _id: req.params.id },
    force: true
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully"
  });
});
exports.SoftDeleteBreeder = Trackerror(async (req, res, next) => {
  const data = await BreederModel.findOne({
    where: { _id: req.params.id }
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await BreederModel.destroy({
    where: { _id: req.params.id }
  });

  res.status(200).json({
    success: true,
    message: "Soft Delete Successfully"
  });
});
