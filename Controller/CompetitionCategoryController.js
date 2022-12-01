const db = require("../config/Connection");
const CompetitionCategoryModel = db.CompetitionCategoryModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const sequelize = require("sequelize");
exports.GetCompetitionCategoryMaxShortCode = Trackerror(async (req, res, next) => {
  const data = await CompetitionCategoryModel.findAll({
    attributes: [
      [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
    ],
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.CreateCompetitionCategory = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortCode } = req.body;
  if (ArRegex.test(NameAr) && ArRegex.test(NameEn) == false) {
    const data = await CompetitionCategoryModel.create({
      shortCode: shortCode,
      NameEn: NameEn,
      NameAr: NameAr
    });
    res.status(201).json({
      success: true,
      data
    });
  } else {
    return next(
      new HandlerCallBack("Please Fill Data To appropiate fields", 404)
    );
  }
});
exports.CompetitionCategoryGet = Trackerror(async (req, res, next) => {
  const data = await CompetitionCategoryModel.findAll({
    include: { all: true }
  });
  res.status(200).json({
    success: true,
    data: data
  });
});
exports.SingleCompetitonCategoryGet = Trackerror(async (req, res, next) => {
    const data = await CompetitionCategoryModel.findAll({
      where: { _id: req.params.id },
      include: { all: true }
    });
    res.status(200).json({
      success: true,
      data: data
    });
  });
exports.GetCompetitionCategoryAdmin = Trackerror(async (req, res, next) => {});
exports.EditCompetitionCategory = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortCode } = req.body;
  let data = await CompetitionCategoryModel.findOne({
    where: { _id: req.params.id }
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const updateddata = {
    shortCode: shortCode || data.shortCode,
    NameEn: NameEn || data.NameEn,
    NameAr: NameAr || data.NameAr
  };
  data = await CompetitionCategoryModel.update(updateddata, {
    where: {
      _id: req.params.id
    }
  });
  res.status(200).json({
    success: true,
    data
  });
});
exports.DeleteCompetitionCategory = Trackerror(async (req, res, next) => {
  const data = await CompetitionCategoryModel.findOne({
    where: { _id: req.params.id }
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await CompetitionCategoryModel.destroy({
    where: { _id: req.params.id },
    force: true
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully"
  });
});
exports.SoftDeleteCompetitionCategory = Trackerror(async (req, res, next) => {
  const data = await CompetitionCategoryModel.findOne({
    where: { _id: req.params.id }
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await CompetitionCategoryModel.destroy({
    where: { _id: req.params.id }
  });

  res.status(200).json({
    success: true,
    message: "Soft Delete Successfully"
  });
});
