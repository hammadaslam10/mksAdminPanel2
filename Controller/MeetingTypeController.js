const db = require("../config/Connection");
const MeetingTypeModel = db.MeetingTypeModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const sequelize = require("sequelize");
exports.GetMeetingTypeMaxShortCode = Trackerror(async (req, res, next) => {
  const data = await MeetingTypeModel.findAll({
    attributes: [
      [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
    ],
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.CreateMeetingType = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortCode } = req.body;
  if (ArRegex.test(NameAr) && ArRegex.test(NameEn) == false) {
    try {
      const data = await MeetingTypeModel.create({
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
        res.send({ status: "error", message: "This Short Code already exists, Please enter a different one." });
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
exports.MeetingTypeGet = Trackerror(async (req, res, next) => {
  const data = await MeetingTypeModel.findAll();
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.GetMeetingTypeAdmin = Trackerror(async (req, res, next) => {});
exports.EditMeetingType = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortCode } = req.body;
  let data = await MeetingTypeModel.findOne({
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
    data = await MeetingTypeModel.update(updateddata, {
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
      res.send({ status: "error", message: "This Short Code already exists, Please enter a different one." });
    } else {
      res.status(500);
      res.send({ status: "error", message: "Something went wrong" });
    }
  }
});
exports.DeleteMeetingType = Trackerror(async (req, res, next) => {
  const data = await MeetingTypeModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await MeetingTypeModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteMeetingType = Trackerror(async (req, res, next) => {
  const data = await MeetingTypeModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await MeetingTypeModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "Soft Delete Successfully",
  });
});
