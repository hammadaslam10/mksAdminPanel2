const db = require("../config/Connection");
const VerdictModel = db.VerdictModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
exports.GetDeletedVerdict = Trackerror(async (req, res, next) => {
  const data = await VerdictModel.findAll({
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
exports.RestoreSoftDeletedVerdict = Trackerror(async (req, res, next) => {
  const data = await VerdictModel.findOne({
    paranoid: false,
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  let checkcode = await VerdictModel.findOne({
    paranoid: false,
    where: { shortCode: -1 * data.shortCode },
  });
  console.log(checkcode);
  if (checkcode) {
    let [result] = await VerdictModel.findAll({
      paranoid: false,
      attributes: [
        [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
      ],
    });
    console.log(-1 * (result.dataValues.maxshortCode + 1));
    let newcode = result.dataValues.maxshortCode + 1;
    console.log(newcode, "dsd");
    await VerdictModel.update(
      { shortCode: newcode },
      {
        where: {
          _id: req.params.id,
        },
        paranoid: false,
      }
    );
    const restoredata = await VerdictModel.restore({
      where: { _id: req.params.id },
    });

    res.status(200).json({
      success: true,
      restoredata,
    });
  } else {
    console.log("done else");
    let newcode = -1 * (data.shortCode + 1);
    console.log(newcode);
    console.log(newcode);
    try {
      await VerdictModel.update(
        { shortCode: newcode },
        {
          where: {
            _id: req.params.id,
          },
          paranoid: false,
        }
      );
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
      } else {
        res.status(500).json({
          success: false,
          message: error,
        });
      }
    }

    const restoredata = await VerdictModel.restore({
      where: { _id: req.params.id },
    });
    res.status(200).json({
      success: true,
      restoredata,
    });
  }
});

exports.GetVerdictMaxShortCode = Trackerror(async (req, res, next) => {
  const data = await VerdictModel.findAll({
    paranoid: false,
    attributes: [
      [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
    ],
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.CreateVerdict = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortCode } = req.body;

  try {
    const data = await VerdictModel.create({
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
      res.json({
        status: "error",
        message: [
          "This Short Code already exists, Please enter a different one.",
        ],
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
exports.VerdictGet = Trackerror(async (req, res, next) => {
  const totalcount = await VerdictModel.count();
  const data = await VerdictModel.findAll({
    offset: Number(req.query.page) - 1 || 0,
    limit: Number(req.query.limit) || 10,
    order: [[req.query.orderby || "createdAt", req.query.sequence || "ASC"]],
    where: {
      NameEn: {
        [Op.like]: `%${req.query.NameEn || ""}%`,
      },
      NameAr: {
        [Op.like]: `%${req.query.NameAr || ""}%`,
      },
      shortCode: {
        [Op.like]: `%${req.query.shortCode || ""}%`,
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
    totalcount,
    filtered: data.length,
  });
});
exports.GetVerdictAdmin = Trackerror(async (req, res, next) => {});
exports.EditVerdict = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortCode } = req.body;
  let data = await VerdictModel.findOne({
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
    data = await VerdictModel.update(updateddata, {
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
      res.json({
        status: "error",
        message: [
          "This Short Code already exists, Please enter a different one.",
        ],
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
exports.DeleteVerdict = Trackerror(async (req, res, next) => {
  const data = await VerdictModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await VerdictModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteVerdict = Trackerror(async (req, res, next) => {
  const data = await VerdictModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  let checkcode = await VerdictModel.findOne({
    paranoid: false,
    where: { shortCode: -data.shortCode },
  });
  console.log(checkcode);
  if (checkcode) {
    console.log("hello");
    let [result] = await VerdictModel.findAll({
      paranoid: false,
      attributes: [
        [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
      ],
    });
    console.log(-result.dataValues.maxshortCode, "dsd");
    await VerdictModel.update(
      { shortCode: -result.dataValues.maxshortCode },
      {
        where: {
          _id: req.params.id,
        },
      }
    );
    await VerdictModel.destroy({
      where: { _id: req.params.id },
    });

    res.status(200).json({
      success: true,
      message: "Soft Delete Successfully",
    });
  } else {
    console.log(data.shortCode);
    await VerdictModel.update(
      { shortCode: -data.shortCode },
      {
        where: {
          _id: req.params.id,
        },
      }
    );

    await VerdictModel.destroy({
      where: { _id: req.params.id },
    });
    res.status(200).json({
      success: true,
      message: "Soft Delete Successfully",
    });
  }
});
