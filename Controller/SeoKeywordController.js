const db = require("../config/Connection");
const SeokeywordModel = db.SeokeywordModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");

exports.CreateSeoKeyword = Trackerror(async (req, res, next) => {
  const { KeywordEn, KeywordAr, TitleEn, TitleAr } = req.body;
 
    const data = await SeokeywordModel.create({
      TitleEn: TitleEn,
      KeywordEn: KeywordEn,
      KeywordAr: KeywordAr,
      TitleAr: TitleAr,
    });
    res.status(201).json({
      success: true,
      data,
    });
 
});
exports.SeoKeywordGet = Trackerror(async (req, res, next) => {
  const data = await SeokeywordModel.findAll();
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.GetSeoKeywordAdmin = Trackerror(async (req, res, next) => {});
exports.EditSeoKeyword = Trackerror(async (req, res, next) => {
  const { KeywordEn, KeywordAr, TitleEn, TitleAr } = req.body;
  let data = await SeokeywordModel.findOne({
    where: { _id: req.params.id },
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const updateddata = {
    TitleEn: TitleEn || data.TitleEn,
    KeywordEn: KeywordEn || data.KeywordEn,
    KeywordAr: KeywordAr || data.KeywordAr,
    TitleAr: TitleAr || data.TitleAr,
  };
  data = await SeokeywordModel.update(updateddata, {
    where: {
      _id: req.params.id,
    },
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.DeleteSeoKeyword = Trackerror(async (req, res, next) => {
  const data = await SeokeywordModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await SeokeywordModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteSeoKeyword = Trackerror(async (req, res, next) => {
  const data = await SeokeywordModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await SeokeywordModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "Soft Delete Successfully",
  });
});
