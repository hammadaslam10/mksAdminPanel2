const db = require("../config/Connection");
const CurrencyModel = db.CurrencyModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");

exports.CreateCurrency = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortCode, Rate } = req.body;
  if (ArRegex.test(NameAr) && ArRegex.test(NameEn) == false) {
    const data = await CurrencyModel.create({
      shortCode: shortCode,
      NameEn: NameEn,
      NameAr: NameAr,
      Rate: Rate,
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
exports.CurrencyGet = Trackerror(async (req, res, next) => {
  const data = await CurrencyModel.findAll();
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.GetCurrencyAdmin = Trackerror(async (req, res, next) => {});
exports.EditCurrency = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortCode, Rate } = req.body;
  let data = await CurrencyModel.findOne({
    where: { _id: req.params.id },
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const updateddata = {
    shortCode: shortCode || data.shortCode,
    NameEn: NameEn || data.NameEn,
    NameAr: NameAr || data.NameAr,
    Rate: Rate || data.Rate,
  };
  data = await CurrencyModel.update(updateddata, {
    where: {
      _id: req.params.id,
    },
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.DeleteCurrency = Trackerror(async (req, res, next) => {
  const data = await CurrencyModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await CurrencyModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteCurrency = Trackerror(async (req, res, next) => {
  const data = await CurrencyModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await CurrencyModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "Soft Delete Successfully",
  });
});
