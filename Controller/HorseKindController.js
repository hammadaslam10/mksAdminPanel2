const db = require("../config/Connection");
const HorseKindModel = db.HorseKindModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const { Op } = require("sequelize");
exports.GetDeletedHorseKind = Trackerror(async (req, res, next) => {
  const data = await HorseKindModel.findAll({
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
exports.RestoreSoftDeletedHorseKind = Trackerror(async (req, res, next) => {
  const data = await HorseKindModel.findOne({
    paranoid: false,
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const restoredata = await HorseKindModel.restore({
    where: { _id: req.params.id },
  });
  res.status(200).json({
    success: true,
    restoredata,
  });
});

exports.CreateHorseKind = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortName, AbbrevEn, AbbrevAr } = req.body;

  const data = await HorseKindModel.create({
    shortName: shortName,
    NameEn: NameEn,
    NameAr: NameAr,
    AbbrevEn: AbbrevEn,
    AbbrevAr: AbbrevAr,
  });
  res.status(201).json({
    success: true,
    data,
  });
});
exports.HorseKindGet = Trackerror(async (req, res, next) => {
  const data = await HorseKindModel.findAll();
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.GetHorseKindAdmin = Trackerror(async (req, res, next) => {});
exports.EditHorseKind = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortName, AbbrevEn, AbbrevAr } = req.body;
  let data = await HorseKindModel.findOne({
    where: { _id: req.params.id },
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const updateddata = {
    shortName: shortName || data.shortName,
    NameEn: NameEn || data.NameEn,
    NameAr: NameAr || data.NameAr,
    AbbrevEn: AbbrevEn || data.AbbrevEn,
    AbbrevAr: AbbrevAr || data.AbbrevAr,
  };
  data = await HorseKindModel.update(updateddata, {
    where: {
      _id: req.params.id,
    },
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.DeleteHorseKind = Trackerror(async (req, res, next) => {
  const data = await HorseKindModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await HorseKindModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteHorseKind = Trackerror(async (req, res, next) => {
  const data = await HorseKindModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await HorseKindModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "Soft Delete Successfully",
  });
});
