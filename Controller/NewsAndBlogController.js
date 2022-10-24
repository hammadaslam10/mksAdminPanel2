const db = require("../config/Connection");
const NewsModel = db.NewsModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { News } = require("../Utils/Path");
const { uploadFile, deleteFile } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const Features = require("../Utils/Features");
exports.CreateNewsAndBlog = Trackerror(async (req, res, next) => {
  const {
    DescriptionEn,
    DescriptionAr,
    TitleEn,
    TitleAr,
    SecondTitleEn,
    SecondTitleAr,
  } = req.body;
  if (
    ArRegex.test(DescriptionAr) &&
    ArRegex.test(TitleAr) &&
    ArRegex.test(SecondTitleAr) &&
    ArRegex.test(DescriptionEn) == false &&
    ArRegex.test(TitleEn) == false &&
    ArRegex.test(SecondTitleEn) == false
  ) {
    const file = req.files.image;
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${News}/${Image}`, file.mimetype);
    const data = await NewsModel.create({
      image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${News}/${Image}`,
      DescriptionEn: DescriptionEn,
      DescriptionAr: DescriptionAr,
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
exports.SearchNews = Trackerror(async (req, res, next) => {});
exports.NewsGet = Trackerror(async (req, res, next) => {
  const data = await NewsModel.findAll();
  res.status(200).json({
    success: true,
    data: data,
  });
});

exports.EditNews = Trackerror(async (req, res, next) => {
  const {
    DescriptionEn,
    DescriptionAr,
    TitleEn,
    TitleAr,
    SecondTitleEn,
    SecondTitleAr,
  } = req.body;
  let data = await NewsModel.findOne({
    where: { _id: req.params.id },
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  if (req.files == null) {
    if (
      ArRegex.test(DescriptionAr) &&
      ArRegex.test(TitleAr) &&
      ArRegex.test(SecondTitleAr) &&
      ArRegex.test(DescriptionEn) == false &&
      ArRegex.test(TitleEn) == false &&
      ArRegex.test(SecondTitleEn) == false
    ) {
      data = await NewsModel.update(req.body, {
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
    await deleteFile(`${News}/${data.image}`);
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${News}/${Image}`, file.mimetype);

    const updateddata = {
      image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${News}/${Image}`,
      DescriptionEn: DescriptionEn || data.DescriptionEn,
      DescriptionAr: DescriptionAr || data.DescriptionAr,
      TitleEn: TitleEn || data.TitleEn,
      TitleAr: TitleAr || data.TitleAr,
      SecondTitleEn: SecondTitleEn || data.SecondTitleEn,
      SecondTitleAr: SecondTitleAr || data.SecondTitleAr,
    };
    if (
      ArRegex.test(updateddata.DescriptionAr) &&
      ArRegex.test(updateddata.TitleAr) &&
      ArRegex.test(updateddata.SecondTitleAr) &&
      ArRegex.test(updateddata.DescriptionEn) == false &&
      ArRegex.test(updateddata.TitleEn) == false &&
      ArRegex.test(updateddata.SecondTitleEn) == false
    ) {
      data = await NewsModel.update(updateddata, {
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
exports.SoftDeleteNews = Trackerror(async (req, res, next) => {
  const data = await NewsModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await NewsModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "Soft Delete Successfully",
  });
});
exports.DeleteNews = Trackerror(async (req, res, next) => {
  const data = await NewsModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);
  await deleteFile(`${News}/${data.image.slice(-64)}`);
  await NewsModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
