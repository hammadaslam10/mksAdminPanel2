const db = require("../config/Connection");
const RaceNameModel = db.RaceNameModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");

exports.CreateRaceName = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortCode } = req.body;
  if (ArRegex.test(NameAr) && ArRegex.test(NameEn) == false) {
    const data = await RaceNameModel.create({
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
exports.RaceNameGet = Trackerror(async (req, res, next) => {
  const data = await RaceNameModel.findAll();
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.GetRaceNameAdmin = Trackerror(async (req, res, next) => {});
exports.EditRaceName = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortCode } = req.body;
  let data = await RaceNameModel.findOne({
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
  data = await RaceNameModel.update(updateddata, {
    where: {
      _id: req.params.id,
    },
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.DeleteRaceName = Trackerror(async (req, res, next) => {
  const data = await RaceNameModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await RaceNameModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteRaceName = Trackerror(async (req, res, next) => {
  const data = await RaceNameModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await RaceNameModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "Soft Delete Successfully",
  });
});
