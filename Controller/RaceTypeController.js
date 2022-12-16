const db = require("../config/Connection");
const RaceTypeModel = db.RaceTypeModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const sequelize = require("sequelize");
exports.GetRaceTypeMaxShortCode = Trackerror(async (req, res, next) => {
  const data = await RaceTypeModel.findAll({
    attributes: [
      [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
    ],
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.CreateRaceType = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortCode } = req.body;
  
    try {
      const data = await RaceTypeModel.create({
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
      }
    }
 
});
exports.RaceTypeGet = Trackerror(async (req, res, next) => {
  const data = await RaceTypeModel.findAll();
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.GetRaceTypeAdmin = Trackerror(async (req, res, next) => {});
exports.EditRaceType = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortCode } = req.body;
  let data = await RaceTypeModel.findOne({
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
    data = await RaceTypeModel.update(updateddata, {
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
exports.DeleteRaceType = Trackerror(async (req, res, next) => {
  const data = await RaceTypeModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await RaceTypeModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteRaceType = Trackerror(async (req, res, next) => {
  const data = await RaceTypeModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await RaceTypeModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "Soft Delete Successfully",
  });
});
