const db = require("../config/Connection");
const NationalityModel = db.NationalityModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { Nationality } = require("../Utils/Path");
const { uploadFile, deleteFile } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const sequelize = require("sequelize");
exports.GetNationalityMaxShortCode = Trackerror(async (req, res, next) => {
  const data = await NationalityModel.findAll({
    attributes: [
      [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
    ],
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.CreateNationality = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, Abbrev, AltName, Label, Offset, Value, shortCode } =
    req.body;
  const file = req.files.image;
  const Image = generateFileName();
  const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
  await uploadFile(fileBuffer, `${Nationality}/${Image}`, file.mimetype);
  if (ArRegex.test(NameAr) && ArRegex.test(NameEn) == false) {
    const data = await NationalityModel.create({
      image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Nationality}/${Image}`,
      Abbrev: Abbrev,
      shortCode: shortCode,
      AltName: AltName,
      Label: Label,
      Offset: Offset,
      Value: Value,
      NameEn: NameEn,
      NameAr: NameAr,
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
exports.NationalityGet = Trackerror(async (req, res, next) => {
  const data = await NationalityModel.findAll();
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.GetNationalityAdmin = Trackerror(async (req, res, next) => {});
exports.EditNationality = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, Abbrev, AltName, Label, Offset, Value, shortCode } =
    req.body;
  let data = await NationalityModel.findOne({
    where: { _id: req.params.id },
  });

  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  if (req.files == null) {
    const updateddata = {
      image: data.image,
      Abbrev: Abbrev || data.Abbrev,
      AltName: AltName || data.AltName,
      shortCode: shortCode || data.shortCode,
      Label: Label || data.Label,
      Offset: Offset || data.Offset,
      NameEn: NameEn || data.NameEn,
      NameAr: NameAr || data.NameAr,
      Value: Value || data.Value,
    };
    try {
      data = await NationalityModel.update(updateddata, {
        where: {
          _id: req.params.id,
        },
      });
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        res.status(403);
        res.send({
          status: "error",
          message:
            "This Short Code already exists, Please enter a different one.",
        });
      } else {
        res.status(500);
        res.send({ status: "error", message: "Something went wrong" });
      }
    }
  } else {
    const file = req.files.image;
    await deleteFile(`${Nationality}/${data.image}`);
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${Nationality}/${Image}`, file.mimetype);
    const updateddata = {
      image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Nationality}/${Image}`,
      Abbrev: Abbrev || data.Abbrev,
      AltName: AltName || data.AltName,
      shortCode: shortCode || data.shortCode,
      Label: Label || data.Label,
      Offset: Offset || data.Offset,
      NameEn: NameEn || data.NameEn,
      NameAr: NameAr || data.NameAr,
      Value: Value || data.Value,
    };
    try {
      data = await NationalityModel.update(updateddata, {
        where: {
          _id: req.params.id,
        },
      });

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        res.status(403);
        res.send({
          status: "error",
          message:
            "This Short Code already exists, Please enter a different one.",
        });
      } else {
        res.status(500);
        res.send({ status: "error", message: "Something went wrong" });
      }
    }
  }
});
exports.DeleteNationality = Trackerror(async (req, res, next) => {
  const data = await NationalityModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);
  await deleteFile(`${Nationality}/${data.image.slice(-64)}`);
  await NationalityModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteNationality = Trackerror(async (req, res, next) => {
  const data = await NationalityModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await NationalityModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "Soft Delete Successfully",
  });
});
