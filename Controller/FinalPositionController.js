const db = require("../config/Connection");
const FinalPositionModel = db.FinalPositionModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const { Op } = require("sequelize");
exports.GetDeletedFinalPosition = Trackerror(async (req, res, next) => {
  const data = await FinalPositionModel.findAll({
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
exports.RestoreSoftDeletedFinalPosition = Trackerror(async (req, res, next) => {
  const data = await FinalPositionModel.findOne({
    paranoid: false,
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const restoredata = await FinalPositionModel.restore({
    where: { _id: req.params.id },
  });
  res.status(200).json({
    success: true,
    restoredata,
  });
});

exports.CreateFinalPosition = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortName, AbbrevEn, AbbrevAr } = req.body;
  try {
    const data = await FinalPositionModel.create({
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
  } catch (error) {
    // if (error.name === "SequelizeUniqueConstraintError") {
    //   res.status(403);
    //   res.json({
    //     status: "error",
    //     message: [
    //       "This Short Code already exists, Please enter a different one.",
    //     ],
    //     error,
    //   });
    // } else {
    res.status(500).json({
      success: false,
      message: error.errors.map((singleerr) => {
        return singleerr.message;
      }),
    });
  }
});
exports.FinalPositionGet = Trackerror(async (req, res, next) => {
  const data = await FinalPositionModel.findAll({
    offset: Number(req.query.page) || 0,
    limit: Number(req.query.limit) || 10,
    order: [[req.query.orderby || "createdAt", req.query.sequence || "ASC"]],
    where: {
      NameEn: {
        [Op.like]: `%${req.query.NameEn || ""}%`,
      },
      NameAr: {
        [Op.like]: `%${req.query.NameAr || ""}%`,
      },
      AbbrevEn: {
        [Op.like]: `%${req.query.AbbrevEn || ""}%`,
      },
      AbbrevAr: {
        [Op.like]: `%${req.query.AbbrevAr || ""}%`,
      },
      createdAt: {
        [Op.between]: [
          req.query.startdate || "2021-12-01 00:00:00",
          req.query.endDate || "4030-12-01 00:00:00",
        ],
      },
    },
  });
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.GetFinalPositionAdmin = Trackerror(async (req, res, next) => {});
exports.EditFinalPosition = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortName, AbbrevEn, AbbrevAr } = req.body;
  let data = await FinalPositionModel.findOne({
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
  data = await FinalPositionModel.update(updateddata, {
    where: {
      _id: req.params.id,
    },
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.DeleteFinalPosition = Trackerror(async (req, res, next) => {
  const data = await FinalPositionModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await FinalPositionModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteFinalPosition = Trackerror(async (req, res, next) => {
  const data = await FinalPositionModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await FinalPositionModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "Soft Delete Successfully",
  });
});
