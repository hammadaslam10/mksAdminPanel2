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
exports.CreateSlider = Trackerror(async (req, res, next) => {
  const { TitleEn, TitleAr } = req.body;
  const file = req.files.image;
  const Image = generateFileName();
  const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
  await uploadFile(fileBuffer, `${Slider}/${Image}`, file.mimetype);
  if (ArRegex.test(TitleAr) && ArRegex.test(TitleEn) == false) {
    const data = await SliderModel.create({
      image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Slider}/${Image}`,
      TitleEn: TitleEn,
      TitleAr: TitleAr,
    });
    res.status(201).json({
      success: true,
      data,
    });
  } else {
    return next(
      new HandlerCallBack("Please Fill Data To appropiate fields", 404)
    );
  }
});
exports.SliderGet = Trackerror(async (req, res, next) => {
  const data = await SliderModel.findAll();
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.GetSliderAdmin = Trackerror(async (req, res, next) => {});
exports.EditSlider = Trackerror(async (req, res, next) => {
  const { TitleEn, TitleAr } = req.body;
  let data = await SliderModel.findOne({
    where: { _id: req.params.id },
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  if (req.files == null) {
    if (ArRegex.test(TitleAr) && ArRegex.test(TitleEn) == false) {
      const updateddata = {
        image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Slider}/${data.image}`,
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
    } else {
      return next(
        new HandlerCallBack("Please Fill Data To appropiate fields", 404)
      );
    }
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
    if (
      ArRegex.test(updateddata.TitleAr) &&
      ArRegex.test(updateddata.TitleEn) == false
    ) {
      data = await SliderModel.update(updateddata, {
        where: {
          _id: req.params.id,
        },
      });
    } else {
      return next(
        new HandlerCallBack("Please Fill Data To appropiate fields", 404)
      );
    }
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
