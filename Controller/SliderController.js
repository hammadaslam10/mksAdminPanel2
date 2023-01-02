const db = require("../config/Connection");
const SliderModel = db.SliderModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { Slider } = require("../Utils/Path");
const { uploadFile, deleteFile, getObjectSignedUrl } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const Features = require("../Utils/Features");
const { Op } = require("sequelize");
exports.GetDeletedSlider = Trackerror(async (req, res, next) => {
  const data = await SliderModel.findAll({
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
exports.RestoreSoftDeletedSlider = Trackerror(async (req, res, next) => {
  const data = await SliderModel.findOne({
    paranoid: false,
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const restoredata = await SliderModel.restore({
    where: { _id: req.params.id },
  });
  res.status(200).json({
    success: true,
    restoredata,
  });
});

exports.CreateSlider = Trackerror(async (req, res, next) => {
  const { TitleEn, TitleAr, Url } = req.body;
  const file = req.files.image;
  if (file == null) {
    return next(new HandlerCallBack("Please upload an image", 404));
  }
  const Image = generateFileName();
  const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
  await uploadFile(fileBuffer, `${Slider}/${Image}`, file.mimetype);

  const data = await SliderModel.create({
    image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Slider}/${Image}`,
    TitleEn: TitleEn,
    TitleAr: TitleAr,
    Url: Url,
  });
  res.status(201).json({
    success: true,
    data,
  });
});
exports.SliderGet = Trackerror(async (req, res, next) => {
  const data = await SliderModel.findAll({
    offset: Number(req.query.page) || 0,
    limit: Number(req.query.limit) || 10,
    order: [[req.query.orderby || "createdAt", req.query.sequence || "ASC"]],
    where: {
      TitleEn: {
        [Op.like]: `%${req.query.TitleEn || ""}%`,
      },
      TitleAr: {
        [Op.like]: `%${req.query.TitleAr || ""}%`,
      },
      Url: {
        [Op.like]: `%${req.query.Url || ""}%`,
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
  });
});
exports.GetSliderAdmin = Trackerror(async (req, res, next) => {});
exports.EditSlider = Trackerror(async (req, res, next) => {
  const { TitleEn, TitleAr, Url } = req.body;
  let data = await SliderModel.findOne({
    where: { _id: req.params.id },
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  if (req.files == null) {
  } else {
    const file = req.files.image;
    await deleteFile(`${Slider}/${data.image}`);
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${Slider}/${Image}`, file.mimetype);

    const updateddata = {
      image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Slider}/${Image}`,
      TitleEn: TitleEn || data.TitleEn,
      TitleAr: TitleAr || data.TitleAr,
    };

    data = await SliderModel.update(updateddata, {
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
exports.DeleteSlider = Trackerror(async (req, res, next) => {
  const data = await SliderModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);
  await deleteFile(`${Slider}/${data.image.slice(-64)}`);
  await SliderModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteSlider = Trackerror(async (req, res, next) => {
  const data = await SliderModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await SliderModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "Soft Delete Successfully",
  });
});
