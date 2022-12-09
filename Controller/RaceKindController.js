const db = require("../config/Connection");
const RaceKindModel = db.RaceKindModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const sequelize = require("sequelize");
exports.GetRaceKindMaxShortCode = Trackerror(async (req, res, next) => {
  const data = await RaceKindModel.findAll({
    attributes: [
      [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
    ],
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.CreateRaceKind = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortCode } = req.body;
  if (ArRegex.test(NameAr) && ArRegex.test(NameEn) == false) {
    try {
      const data = await RaceKindModel.create({
        shortCode: shortCode,
        NameEn: NameEn,
        NameAr: NameAr,
      });
      res.status(201).json({
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
    return next(
      new HandlerCallBack("Please Fill Data To appropiate fields", 404)
    );
  }
});
exports.RaceKindGet = Trackerror(async (req, res, next) => {
  const data = await RaceKindModel.findAll();
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.GetRaceKindAdmin = Trackerror(async (req, res, next) => {});
exports.EditRaceKind = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortCode } = req.body;
  let data = await RaceKindModel.findOne({
    where: { _id: req.params.id },
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  try {
    const updateddata = {
      shortCode: shortCode || data.shortCode,
      NameEn: NameEn || data.NameEn,
      NameAr: NameAr || data.NameAr,
    };
    data = await RaceKindModel.update(updateddata, {
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
});
exports.DeleteRaceKind = Trackerror(async (req, res, next) => {
  const data = await RaceKindModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await RaceKindModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteRaceKind = Trackerror(async (req, res, next) => {
  const data = await RaceKindModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await RaceKindModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "Soft Delete Successfully",
  });
});
