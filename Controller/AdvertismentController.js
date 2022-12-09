const db = require("../config/Connection");
const sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");
const AdvertismentModel = db.AdvertismentModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { Ads } = require("../Utils/Path");
const { Op } = require("sequelize");
const { uploadFile, deleteFile } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const { EnglishRegex } = require("../Utils/EnglishLanguageRegex");
const Features = require("../Utils/Features");
const io = require("../socket");

exports.CreateAdvertisment = Trackerror(async (req, res, next) => {
  const { DescriptionEn, DescriptionAr, TitleEn, TitleAr } = req.body;
  // const file = req.files.image;
  // const Image = generateFileName();
  // const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
  // await uploadFile(fileBuffer, `${Ads}/${Image}`, file.mimetype);
  // https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Ads}/${Image}
  console.log(ArRegex.test(DescriptionAr));
  console.log(ArRegex.test(TitleAr.trim()));
  const data = await AdvertismentModel.create({
    image: `a`,
    DescriptionEn: DescriptionEn,
    DescriptionAr: DescriptionAr,
    TitleEn: TitleEn,
    TitleAr: TitleAr,
  });
  res.status(201).json({
    success: true,
    data,
  });
});
exports.AdsGet = Trackerror(async (req, res, next) => {
  // "SELECT `_id`, `image`, `DescriptionEn`, `DescriptionAr`, `TitleEn`, `TitleAr`, `createdAt`, `updatedAt`, `deletedAt` FROM `AdvertismentModel` AS `AdvertismentModel` WHERE (`AdvertismentModel`.`deletedAt` IS NULL);";
  // const [results, metadata] = await db.sequelize.query(
  //   "SELECT * FROM `AdvertismentModel` AS `AdvertismentModel` WHERE (`AdvertismentModel`.`deletedAt` IS NULL);"
  // );
  // const data = await db.sequelize.query(
  //   ` SELECT _id, image, DescriptionEn, DescriptionAr, TitleEn, TitleAr, createdAt, updatedAt,TIMEDIFF(createdAt, updatedAt)  As TimeInMinutes, deletedAt FROM AdvertismentModel AS AdvertismentModel WHERE (AdvertismentModel.deletedAt IS NULL);`
  // );
  // Results will be an empty array and metadata will contain the number of affected rows.
  const data = await AdvertismentModel.findAll();
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.GetAdsAdmin = Trackerror(async (req, res, next) => {});
exports.EditAds = Trackerror(async (req, res, next) => {
  const { DescriptionEn, DescriptionAr, TitleEn, TitleAr } = req.body;
  let data = await AdvertismentModel.findOne({
    where: { _id: req.params.id },
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  if (req.files == null) {
    if (
      ArRegex.test(DescriptionAr) &&
      ArRegex.test(TitleAr) &&
      ArRegex.test(DescriptionEn) == false &&
      ArRegex.test(TitleEn) == false
    ) {
      const updateddata = {
        image: data.image,
        DescriptionEn: DescriptionEn || data.DescriptionEn,
        DescriptionAr: DescriptionAr || data.DescriptionAr,
        TitleEn: TitleEn || data.TitleEn,
        TitleAr: TitleAr || data.TitleAr,
      };
      data = await AdvertismentModel.update(updateddata, {
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
    await deleteFile(`${Ads}/${data.image}`);
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${Ads}/${Image}`, file.mimetype);
    const updateddata = {
      image: "",
      DescriptionEn: DescriptionEn || data.DescriptionEn,
      DescriptionAr: DescriptionAr || data.DescriptionAr,
      TitleEn: TitleEn || data.TitleEn,
      TitleAr: TitleAr || data.TitleAr,
    };
    if (
      ArRegex.test(updateddata.DescriptionAr) &&
      ArRegex.test(updateddata.TitleAr) &&
      ArRegex.test(updateddata.DescriptionEn) == false &&
      ArRegex.test(updateddata.TitleEn) == false
    ) {
      (updateddata.image = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Ads}/${Image}`),
        (data = await AdvertismentModel.update(updateddata, {
          where: {
            _id: req.params.id,
          },
        }));
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
exports.DeleteAds = Trackerror(async (req, res, next) => {
  const data = await AdvertismentModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);
  await deleteFile(`${Ads}/${data.image.slice(-64)}`);
  await AdvertismentModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteAds = Trackerror(async (req, res, next) => {
  const data = await AdvertismentModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await AdvertismentModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "Soft Delete Successfully",
  });
});
exports.AdsGetlive = Trackerror(async (req, res, next) => {});
