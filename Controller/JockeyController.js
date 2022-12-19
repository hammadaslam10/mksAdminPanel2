const db = require("../config/Connection");
const JockeyModel = db.JockeyModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { Jockey } = require("../Utils/Path");
const { uploadFile, deleteFile } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const Features = require("../Utils/Features");
const { Op } = require("sequelize");
exports.GetDeletedJockey = Trackerror(async (req, res, next) => {
  const data = await JockeyModel.findAll({
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
exports.RestoreSoftDeletedJockey = Trackerror(async (req, res, next) => {
  const data = await JockeyModel.findOne({
    paranoid: false,
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const restoredata = await JockeyModel.restore({
    where: { _id: req.params.id },
  });
  res.status(200).json({
    success: true,
    restoredata,
  });
});

exports.CreateJockey = Trackerror(async (req, res, next) => {
  const {
    NameEn,
    NameAr,
    RemarksEn,
    RemarksAr,
    Rating,
    ShortNameEn,
    ShortNameAr,
    NationalityID,
    MiniumumJockeyWeight,
    MaximumJockeyWeight,
    JockeyAllowance,
    DOB,
    JockeyLicenseDate,
  } = req.body;
  const file = req.files.image;
  if (file == null) {
    return next(new HandlerCallBack("Please upload an image", 404));
  }
  const Image = generateFileName();
  const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
  await uploadFile(fileBuffer, `${Jockey}/${Image}`, file.mimetype);
  if (!NameEn || !Rating) {
    return next(
      new HandlerCallBack("Please Fill Appropiate Detail Of Jockey", 404)
    );
  } else {
    const data = await JockeyModel.create({
      image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Jockey}/${Image}`,
      NameEn: NameEn,
      NameAr: NameAr,
      ShortNameEn: ShortNameEn,
      ShortNameAr: ShortNameAr,
      MiniumumJockeyWeight: MiniumumJockeyWeight,
      MaximumJockeyWeight: MaximumJockeyWeight,
      JockeyAllowance: JockeyAllowance,
      DOB: DOB,
      NationalityID: NationalityID,
      RemarksEn: RemarksEn,
      RemarksAr: RemarksAr,
      JockeyLicenseDate: JockeyLicenseDate,
      Rating: Rating,
    });
    res.status(201).json({
      success: true,
      data,
    });
  }
});
exports.SingleJockey = Trackerror(async (req, res, next) => {
  const data = await JockeyModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("Jockey is not available", 404));
  } else {
    res.status(200).json({
      success: true,
      data,
    });
  }
});
exports.GetJockey = Trackerror(async (req, res, next) => {
  const data = await JockeyModel.findAll({
    include: { all: true },
  });
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.GetJockeyforRace = Trackerror(async (req, res, next) => {
  const { Jockeyids, JockeyName } = req.body;
  const data = await JockeyModel.findAll({
    where: {
      [Op.and]: [
        {
          _id: {
            [Op.ne]: Jockeyids,
          },
        },
        {
          NameEn: {
            [Op.like]: `%${JockeyName}%`,
          },
          NameAr: {
            [Op.like]: `%${JockeyName}%`,
          },
        },
      ],
    },
  });
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.EditJockey = Trackerror(async (req, res, next) => {
  const {
    NameEn,
    NameAr,
    ShortNameEn,
    ShortNameAr,
    NationalityID,
    MiniumumJockeyWeight,
    JockeyAllowance,
    MaximumJockeyWeight,
    Rating,
    DOB,
    JockeyLicenseDate,
  } = req.body;
  console.log(req.body);
  // if ((NationalityID = "")) {
  //   NationalityID = null;
  // }
  // if ((Rating = "")) {
  //   Rating = null;
  // }
  let data = await JockeyModel.findOne({
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
      MiniumumJockeyWeight: MiniumumJockeyWeight || data.MiniumumJockeyWeight,
      MaximumJockeyWeight: MaximumJockeyWeight || data.MaximumJockeyWeight,
      DOB: DOB || data.DOB,
      JockeyAllowance: JockeyAllowance || data.JockeyAllowance,
      NationalityID: NationalityID || data.NationalityID,
      Rating: Rating || data.Rating,
      JockeyLicenseDate: JockeyLicenseDate || data.JockeyLicenseDate,
    };
    data = await JockeyModel.update(updateddata, {
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
    await deleteFile(`${Jockey}/${data.image}`);
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${Jockey}/${Image}`, file.mimetype);

    const updateddata = {
      image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Jockey}/${Image}`,
      NameEn: NameEn || data.NameEn,
      NameAr: NameAr || data.NameAr,
      ShortNameEn: ShortNameEn || data.ShortNameEn,
      ShortNameAr: ShortNameAr || data.ShortNameAr,
      MiniumumJockeyWeight: MiniumumJockeyWeight || data.MiniumumJockeyWeight,
      MaximumJockeyWeight: MaximumJockeyWeight || data.MaximumJockeyWeight,
      DOB: DOB || data.DOB,
      JockeyAllowance: JockeyAllowance || data.JockeyAllowance,
      NationalityID: NationalityID || data.NationalityID,
      Rating: Rating || data.Rating,
    };

    data = await JockeyModel.update(updateddata, {
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
exports.DeleteJockey = Trackerror(async (req, res, next) => {
  const data = await JockeyModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);
  await deleteFile(`${Jockey}/${data.image.slice(-64)}`);
  await JockeyModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteJockey = Trackerror(async (req, res, next) => {
  const data = await JockeyModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);
  await deleteFile(`${Jockey}/${data.image.slice(-64)}`);
  await JockeyModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
