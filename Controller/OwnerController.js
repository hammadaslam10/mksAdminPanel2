const db = require("../config/Connection");
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const OwnerModel = db.OwnerModel;
const { uploadFile, deleteFile, getObjectSignedUrl } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const { Owner } = require("../Utils/Path");
const Features = require("../Utils/Features");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
exports.CreateOwner = Trackerror(async (req, res, next) => {
  const {
    NameEn,
    NameAr,
    SilkColor,
    TitleAr,
    TitleEn,
    Horses,
    Rating,
    ShortEn,
    ShortAr,
    RegistrationDate,
    NationalityID,
  } = req.body;
  const file = req.files.image;
  const Image = generateFileName();
  const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
  await uploadFile(fileBuffer, `${Owner}/${Image}`, file.mimetype);
  const data = await OwnerModel.create({
    image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Owner}/${Image}`,
    NameEn: NameEn,
    NameAr: NameAr,
    Rating: Rating,
    ShortEn: ShortEn,
    ShortAr: ShortAr,
    TitleAr: TitleAr,
    TitleEn: TitleEn,
    NationalityID: NationalityID,
    SilkColor: SilkColor,
    RegistrationDate: RegistrationDate,
  });
  console.log(data);
  res.status(201).json({
    success: true,
    data,
  });
});
exports.UpdateOwnerDetail = Trackerror(async (req, res, next) => {
  const {
    NameEn,
    NameAr,
    SilkColor,
    TitleAr,
    TitleEn,
    Horses,
    Rating,
    ShortEn,
    ShortAr,
    RegistrationDate,
    NationalityID,
  } = req.body;
  let data = await OwnerModel.findOne({
    where: { _id: req.params.id },
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  if (req.files == null) {
    if (
      ArRegex.test(NameAr) &&
      ArRegex.test(TitleAr) &&
      ArRegex.test(NameEn) == false &&
      ArRegex.test(TitleEn) == false
    ) {
      const updateddata = {
        image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Owner}/${data.image}`,
        NameEn: NameEn || data.NameEn,
        NameAr: NameAr || data.NameAr,
        ShortEn: ShortEn || data.ShortEn,
        ShortAr: ShortAr || data.ShortAr,
        RegistrationDate: RegistrationDate || data.RegistrationDate,
        NationalityID: NationalityID || data.NationalityID,
        SilkColor: SilkColor || data.SilkColor,
        Horses: Horses || data.Horses,
        Rating: Rating || data.Rating,
      };
      data = await OwnerModel.update(updateddata, {
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
    await deleteFile(`${Owner}/${data.image}`);
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${Owner}/${Image}`, file.mimetype);
    const updateddata = {
      image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Owner}/${data.image}`,
      NameEn: NameEn || data.NameEn,
      NameAr: NameAr || data.NameAr,
      ShortEn: ShortEn || data.ShortEn,
      ShortAr: ShortAr || data.ShortAr,
      RegistrationDate: RegistrationDate || data.RegistrationDate,
      NationalityID: NationalityID || data.NationalityID,
      SilkColor: SilkColor || data.SilkColor,
      Horses: Horses || data.Horses,
      Rating: Rating || data.Rating,
    };
    if (
      ArRegex.test(updateddata.NameAr) &&
      ArRegex.test(updateddata.TitleAr) &&
      ArRegex.test(updateddata.NameEn) == false &&
      ArRegex.test(updateddata.TitleEn) == false
    ) {
      data = await OwnerModel.update(updateddata, {
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
exports.UpdateOwnerHorse = Trackerror(async (req, res, next) => {});
exports.ViewAllOwner = Trackerror(async (req, res, next) => {
  const data = await OwnerModel.findAll({ include: { all: true } });
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.ViewASingleOwner = Trackerror(async (req, res, next) => {
  const data = await OwnerModel.findOne({
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
exports.DeleteOwner = Trackerror(async (req, res, next) => {
  const data = await OwnerModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);
  await deleteFile(`${Owner}/${data.image.slice(-64)}`);
  await OwnerModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteOwner = Trackerror(async (req, res, next) => {
  const data = await OwnerModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await OwnerModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "Soft Delete Successfully",
  });
});
