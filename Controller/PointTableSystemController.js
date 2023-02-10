const db = require("../config/Connection");
const PointTableSystemModel = db.PointTableSystemModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const { getPagination, getPagingData } = require("../Utils/Pagination");
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

    let checkcode = await PointTableSystemModel.findOne({
      paranoid: false,
      where: { shortCode: -1 * data.shortCode },
    });
    console.log(checkcode);
    if (checkcode) {
      let [result] = await PointTableSystemModel.findAll({
        paranoid: false,
        attributes: [
          [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
        ],
      });
      console.log(-1 * (result.dataValues.maxshortCode + 1));
      let newcode = result.dataValues.maxshortCode + 1;
      console.log(newcode, "dsd");
      await PointTableSystemModel.update(
        { shortCode: newcode },
        {
          where: {
            _id: req.params.id,
          },
          paranoid: false,
        }
      );
      const restoredata = await PointTableSystemModel.restore({
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
        await PointTableSystemModel.update(
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

      const restoredata = await PointTableSystemModel.restore({
        where: { _id: req.params.id },
      });
      res.status(200).json({
        success: true,
        restoredata,
      });
    }
  }
);

exports.GetPointTableSystemMaxShortCode = Trackerror(async (req, res, next) => {
  const data = await PointTableSystemModel.findAll({
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
exports.CreatePointTableSystem = Trackerror(async (req, res, next) => {
  const { shortCode, Group_Name, Rank, Point, Bonus_Point } = req.body;

  try {
    const data = await PointTableSystemModel.create({
      shortCode: shortCode,
      Group_Name: Group_Name,
      Rank: Rank,
      Point: Point,
      Bonus_Point: Bonus_Point,
    });
    console.log(data);
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
exports.PointTableSystemGet = Trackerror(async (req, res, next) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page - 1, size);
  await PointTableSystemModel.findAndCountAll({
    order: [[req.query.orderby || "createdAt", req.query.sequence || "ASC"]],
    where: {
      Group_Name: {
        [Op.like]: `%${req.query.Group_Name || ""}%`,
      },
      Rank: {
        [Op.like]: `%${req.query.Rank || ""}%`,
      },
      Bonus_Point: {
        [Op.like]: `%${req.query.Bonus_Point || ""}%`,
      },
      Point: {
        [Op.like]: `%${req.query.DescriptionAr || ""}%`,
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
    limit,
    offset,
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.status(200).json({
        data: response.data,
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalcount: response.totalcount,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message || "Some error occurred while retrieving Color.",
      });
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
  const { Group_Name, Rank, Point, Bonus_Point, shortCode } = req.body;
  let data = await PointTableSystemModel.findOne({
    where: { _id: req.params.id },
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const updateddata = {
    shortCode: shortCode || data.shortCode,
    Group_Name: Group_Name || data.Group_Name,
    Rank: Rank || data.Rank,
    Bonus_Point: Bonus_Point || data.Bonus_Point,
    Point: Point || data.Point,
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
  let checkcode = await PointTableSystemModel.findOne({
    paranoid: false,
    where: { shortCode: -data.shortCode },
  });
  console.log(checkcode);
  if (checkcode) {
    console.log("hello");
    let [result] = await PointTableSystemModel.findAll({
      paranoid: false,
      attributes: [
        [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
      ],
    });
    console.log(-result.dataValues.maxshortCode, "dsd");
    await PointTableSystemModel.update(
      { shortCode: -result.dataValues.maxshortCode },
      {
        where: {
          _id: req.params.id,
        },
      }
    );
    await PointTableSystemModel.destroy({
      where: { _id: req.params.id },
    });

    res.status(200).json({
      success: true,
      message: "Soft Delete Successfully",
    });
  } else {
    console.log(data.shortCode);
    await PointTableSystemModel.update(
      { shortCode: -data.shortCode },
      {
        where: {
          _id: req.params.id,
        },
      }
    );

    await PointTableSystemModel.destroy({
      where: { _id: req.params.id },
    });
    res.status(200).json({
      success: true,
      message: "Soft Delete Successfully",
    });
  }
});
