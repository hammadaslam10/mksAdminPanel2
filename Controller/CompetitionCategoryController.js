const db = require("../config/Connection");
const CompetitionCategoryModel = db.CompetitionCategoryModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const { getPagination, getPagingData } = require("../Utils/Pagination");
exports.GetDeletedCompetitionCategory = Trackerror(async (req, res, next) => {
  const data = await CompetitionCategoryModel.findAll({
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
exports.RestoreSoftDeletedCompetitionCategory = Trackerror(
  async (req, res, next) => {
    const data = await CompetitionCategoryModel.findOne({
      paranoid: false,
      where: { _id: req.params.id },
    });
    if (!data) {
      return next(new HandlerCallBack("data not found", 404));
    }

    let checkcode = await CompetitionCategoryModel.findOne({
      paranoid: false,
      where: { shortCode: -1 * data.shortCode },
    });
    console.log(checkcode);
    if (checkcode) {
      let [result] = await CompetitionCategoryModel.findAll({
        paranoid: false,
        attributes: [
          [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
        ],
      });
      console.log(-1 * (result.dataValues.maxshortCode + 1));
      let newcode = result.dataValues.maxshortCode + 1;
      console.log(newcode, "dsd");
      await CompetitionCategoryModel.update(
        { shortCode: newcode },
        {
          where: {
            _id: req.params.id,
          },
          paranoid: false,
        }
      );
      const restoredata = await CompetitionCategoryModel.restore({
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
        await CompetitionCategoryModel.update(
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

      const restoredata = await CompetitionCategoryModel.restore({
        where: { _id: req.params.id },
      });
      res.status(200).json({
        success: true,
        restoredata,
      });
    }
  }
);

exports.GetCompetitionCategoryMaxShortCode = Trackerror(
  async (req, res, next) => {
    const data = await CompetitionCategoryModel.findAll({
      attributes: [
        [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
      ],
    });
    res.status(200).json({
      success: true,
      data,
    });
  }
);
exports.CreateCompetitionCategory = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortCode } = req.body;

  try {
    const data = await CompetitionCategoryModel.create({
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
exports.SearchCompetitionCategory = Trackerror(async (req, res, next) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page - 1, size);
  await CompetitionCategoryModel.findAndCountAll({
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
exports.CompetitionCategoryGet = Trackerror(async (req, res, next) => {
  const data = await CompetitionCategoryModel.findAll({
    include: { all: true },
  });
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.SingleCompetitonCategoryGet = Trackerror(async (req, res, next) => {
  const data = await CompetitionCategoryModel.findAll({
    where: { _id: req.params.id },
    include: { all: true },
  });
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.GetCompetitionCategoryAdmin = Trackerror(async (req, res, next) => {});
exports.EditCompetitionCategory = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortCode } = req.body;
  let data = await CompetitionCategoryModel.findOne({
    where: { _id: req.params.id },
  });
  try {
    if (data === null) {
      return next(new HandlerCallBack("data not found", 404));
    }

    const updateddata = {
      shortCode: shortCode || data.shortCode,
      NameEn: NameEn || data.NameEn,
      NameAr: NameAr || data.NameAr,
    };
    data = await CompetitionCategoryModel.update(updateddata, {
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
exports.DeleteCompetitionCategory = Trackerror(async (req, res, next) => {
  const data = await CompetitionCategoryModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await CompetitionCategoryModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteCompetitionCategory = Trackerror(async (req, res, next) => {
  const data = await CompetitionCategoryModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  let checkcode = await CompetitionCategoryModel.findOne({
    paranoid: false,
    where: { shortCode: -data.shortCode },
  });
  console.log(checkcode);
  if (checkcode) {
    console.log("hello");
    let [result] = await CompetitionCategoryModel.findAll({
      paranoid: false,
      attributes: [
        [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
      ],
    });
    console.log(-result.dataValues.maxshortCode, "dsd");
    await CompetitionCategoryModel.update(
      { shortCode: -result.dataValues.maxshortCode },
      {
        where: {
          _id: req.params.id,
        },
      }
    );
    await CompetitionCategoryModel.destroy({
      where: { _id: req.params.id },
    });

    res.status(200).json({
      success: true,
      message: "Soft Delete Successfully",
    });
  } else {
    console.log(data.shortCode);
    await CompetitionCategoryModel.update(
      { shortCode: -data.shortCode },
      {
        where: {
          _id: req.params.id,
        },
      }
    );

    await CompetitionCategoryModel.destroy({
      where: { _id: req.params.id },
    });
    res.status(200).json({
      success: true,
      message: "Soft Delete Successfully",
    });
  }
});
