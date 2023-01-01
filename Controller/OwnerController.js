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
const { Conversion } = require("../Utils/Conversion");
const OwnerSilkColorModel = db.OwnerSilkColorModel;
const { Op } = require("sequelize");
exports.GetDeletedOwner = Trackerror(async (req, res, next) => {
  const data = await OwnerModel.findAll({
    paranoid: false,
    where: {
      [Op.not]: { deletedAt: null }
    }
  });
  res.status(200).json({
    success: true,
    data
  });
});
exports.RestoreSoftDeletedOwner = Trackerror(async (req, res, next) => {
  const data = await OwnerModel.findOne({
    paranoid: false,
    where: { _id: req.params.id }
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const restoredata = await OwnerModel.restore({
    where: { _id: req.params.id }
  });
  res.status(200).json({
    success: true,
    restoredata
  });
});

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
    NationalityID
  } = req.body;
  if (req.files === null) {
    try {
      const data = await OwnerModel.create({
        image: `https://${
          process.env.AWS_BUCKET_NAME
        }.s3.amazonaws.com/${Owner}/${"1009af09d9cccd2f31a2ae991fbf39653e9a837ef40123c1717f014c91aa9eac"}`,
        NameEn: NameEn,
        NameAr: NameAr,
        Rating: Rating,
        ShortEn: ShortEn,
        ShortAr: ShortAr,
        TitleAr: TitleAr,
        TitleEn: TitleEn,
        NationalityID: NationalityID,
        RegistrationDate: RegistrationDate
      });
      res.status(201).json({
        success: true,
        data
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        res.status(403);
        res.send({
          status: "error",
          message: [
            "This Short Code already exists, Please enter a different one."
          ]
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.errors.map((singleerr) => {
            return singleerr.message;
          })
        });
      }
    }
  } else {
    const file = req.files.image;
    console.log(file, "file");
    const file1 = req.files.Ownerimage;
    console.log(file1, "file1");
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(
      req.files.Ownerimage.data,
      214,
      212
    );
    await uploadFile(fileBuffer, `${Owner}/${Image}`, file1.mimetype);
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
      RegistrationDate: RegistrationDate
    });

    if (data._id) {
      let file = [req.files.image];
      await file.map(async (singleimage) => {
        console.log(singleimage, "dsadsa");
        let SingleImage = generateFileName();
        console.log(singleimage);
        let SingleimagefileBuffer = await resizeImageBuffer(
          singleimage.data,
          214,
          212
        );
        await uploadFile(
          SingleimagefileBuffer,
          `${Owner}/${SingleImage}`,
          singleimage.mimetype
        );
        await OwnerSilkColorModel.findOrCreate({
          where: {
            OwnerID: data._id,
            OwnerSilkColor: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Owner}/${SingleImage}`
          }
        });
      });
    } else {
      return next(new HandlerCallBack("Owner Creation Failed", 404));
    }
    res.status(201).json({
      success: true,
      data
    });
  }
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
    NationalityID
  } = req.body;
  let data = await OwnerModel.findOne({
    where: { _id: req.params.id }
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  if (req.files == null) {
    const updateddata = {
      image: data.Ownerimage,
      NameEn: NameEn || data.NameEn,
      NameAr: NameAr || data.NameAr,
      ShortEn: ShortEn || data.ShortEn,
      TitleAr: TitleAr || data.TitleAr,
      TitleEn: TitleEn || data.TitleEn,
      ShortAr: ShortAr || data.ShortAr,
      RegistrationDate: RegistrationDate || data.RegistrationDate,
      NationalityID: NationalityID || data.NationalityID,
      SilkColor: SilkColor || data.SilkColor,
      Horses: Horses || data.Horses,
      Rating: Rating || data.Rating
    };
    data = await OwnerModel.update(updateddata, {
      where: {
        _id: req.params.id
      }
    });
    res.status(200).json({
      success: true,
      data
    });
  } else {
    const file = req.files.Ownerimage;
    await deleteFile(`${Owner}/${data.Ownerimage}`);
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${Owner}/${Image}`, file.mimetype);
    const updateddata = {
      image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Owner}/${Image}`,
      NameEn: NameEn || data.NameEn,
      NameAr: NameAr || data.NameAr,
      ShortEn: ShortEn || data.ShortEn,
      ShortAr: ShortAr || data.ShortAr,
      RegistrationDate: RegistrationDate || data.RegistrationDate,
      NationalityID: NationalityID || data.NationalityID,
      SilkColor: SilkColor || data.SilkColor,
      Horses: Horses || data.Horses,
      Rating: Rating || data.Rating,
      TitleAr: TitleAr || data.TitleAr,
      TitleEn: TitleEn || data.TitleEn
    };

    data = await OwnerModel.update(updateddata, {
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
exports.UpdateOwnerHorse = Trackerror(async (req, res, next) => {});
exports.ViewAllOwner = Trackerror(async (req, res, next) => {
  const data = await OwnerModel.findAll({ include: { all: true } });
  res.status(200).json({
    success: true,
    data: data
  });
});
exports.ViewASingleOwner = Trackerror(async (req, res, next) => {
  const data = await OwnerModel.findOne({
    where: { _id: req.params.id }
  });
  if (!data) {
    return new next("Owner is not available", 404);
  } else {
    res.status(200).json({
      success: true,
      data
    });
  }
});
exports.DeleteOwner = Trackerror(async (req, res, next) => {
  const data = await OwnerModel.findOne({
    where: { _id: req.params.id }
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);
  await deleteFile(`${Owner}/${data.image.slice(-64)}`);
  await OwnerModel.destroy({
    where: { _id: req.params.id },
    force: true
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully"
  });
});
exports.SoftDeleteOwner = Trackerror(async (req, res, next) => {
  const data = await OwnerModel.findOne({
    where: { _id: req.params.id }
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await OwnerModel.destroy({
    where: { _id: req.params.id }
  });

  res.status(200).json({
    success: true,
    message: "Soft Delete Successfully"
  });
});
