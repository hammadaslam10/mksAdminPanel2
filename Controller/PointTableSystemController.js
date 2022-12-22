const db = require("../config/Connection");
const PointTableSystemModel = db.PointTableSystemModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
exports.GetDeletedPointTableSystem = Trackerror(async (req, res, next) => {
  const data = await PointTableSystemModel.findAll({
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
exports.RestoreSoftDeletedPointTableSystem = Trackerror(
  async (req, res, next) => {
    const data = await PointTableSystemModel.findOne({
      paranoid: false,
      where: { _id: req.params.id },
    });
    if (!data) {
      return next(new HandlerCallBack("data not found", 404));
    }
    const restoredata = await PointTableSystemModel.restore({
      where: { _id: req.params.id },
    });
    res.status(200).json({
      success: true,
      restoredata,
    });
  }
);

exports.GetPointTableSystemMaxShortCode = Trackerror(async (req, res, next) => {
  const data = await PointTableSystemModel.findAll({
    attributes: [
      [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
    ],
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.CreatePointTableSystem = Trackerror(async (req, res, next) => {
  const {
    Group_Name,
    First_Place_Point,
    First_Place_Bonus_Point,
    Second_Place_Bonus_Point,
    shortCode,
    Second_Place_Point,
    Third_Place_Point,
    Third_Place_Bonus_Point,
  } = req.body;

  try {
    const data = await PointTableSystemModel.create({
      shortCode: shortCode,
      Group_Name: Group_Name,
      First_Place_Point: First_Place_Point,
      Second_Place_Point: Second_Place_Point,
      Third_Place_Point: Third_Place_Point,
      First_Place_Bonus_Point: First_Place_Bonus_Point,
      Second_Place_Bonus_Point: Second_Place_Bonus_Point,
      Third_Place_Bonus_Point: Third_Place_Bonus_Point,
    });
    console.log(data);
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
      res.status(500).json({
        success: false,
        message: error.errors.map((singleerr) => {
          return singleerr.message;
        }),
      });
    }
  }
});
exports.PointTableSystemGet = Trackerror(async (req, res, next) => {
  const data = await PointTableSystemModel.findAll();
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.SinglePointTableSystem = Trackerror(async (req, res, next) => {
  const data = await PointTableSystemModel.findOne({
    where: { _id: req.params.id },
    include: { all: true },
  });
  if (!data) {
    return next(new HandlerCallBack("Race is Not Available", 404));
  } else {
    res.status(200).json({
      success: true,
      data,
    });
  }
});
exports.GetPointTableSystemAdmin = Trackerror(async (req, res, next) => {});
exports.EditPointTableSystem = Trackerror(async (req, res, next) => {
  const {
    Group_Name,
    First_Place_Point,
    First_Place_Bonus_Point,
    Second_Place_Bonus_Point,
    shortCode,
    Second_Place_Point,
    Third_Place_Point,
    Third_Place_Bonus_Point,
  } = req.body;
  let data = await PointTableSystemModel.findOne({
    where: { _id: req.params.id },
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const updateddata = {
    shortCode: shortCode || data.shortCode,
    Group_Name: Group_Name || data.Group_Name,
    First_Place_Point: First_Place_Point || data.First_Place_Point,
    Third_Place_Point: Third_Place_Point || data.Third_Place_Point,
    Second_Place_Point: Second_Place_Point || data.Second_Place_Point,
    Third_Place_Bonus_Point:
      Third_Place_Bonus_Point || data.Third_Place_Bonus_Point,
    Second_Place_Bonus_Point:
      Second_Place_Bonus_Point || data.Second_Place_Bonus_Point,
    First_Place_Bonus_Point:
      First_Place_Bonus_Point || data.First_Place_Bonus_Point,
  };
  try {
    data = await PointTableSystemModel.update(updateddata, {
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
      res.status(500).json({
        success: false,
        message: error.errors.map((singleerr) => {
          return singleerr.message;
        }),
      });
    }
  }
});
exports.DeletePointTableSystem = Trackerror(async (req, res, next) => {
  const data = await PointTableSystemModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await PointTableSystemModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeletePointTableSystem = Trackerror(async (req, res, next) => {
  const data = await PointTableSystemModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await PointTableSystemModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "Soft Delete Successfully",
  });
});
