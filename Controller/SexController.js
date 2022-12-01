const db = require("../config/Connection");
const SexModel = db.SexModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const sequelize = require("sequelize");
exports.GetSexMaxShortCode = Trackerror(async (req, res, next) => {
  const data = await SexModel.findAll({
    attributes: [
      [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
    ],
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.CreateSex = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortCode } = req.body;
  if (ArRegex.test(NameAr) && ArRegex.test(NameEn) == false) {
    const data = await SexModel.create({
      shortCode: shortCode,
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
exports.SexGet = Trackerror(async (req, res, next) => {
  const data = await SexModel.findAll();
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.GetSexAdmin = Trackerror(async (req, res, next) => {});
exports.EditSex = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortCode } = req.body;
  let data = await SexModel.findOne({
    where: { _id: req.params.id },
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const updateddata = {
    shortCode: shortCode || data.shortCode,
    NameEn: NameEn || data.NameEn,
    NameAr: NameAr || data.NameAr,
  };
  data = await SexModel.update(updateddata, {
    where: {
      _id: req.params.id,
    },
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.DeleteSex = Trackerror(async (req, res, next) => {
  const data = await SexModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await SexModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteSex = Trackerror(async (req, res, next) => {
  const data = await SexModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await SexModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "Soft Delete Successfully",
  });
});
