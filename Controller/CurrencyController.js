const db = require("../config/Connection");
const CurrencyModel = db.CurrencyModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const { getPagination, getPagingData } = require("../Utils/Pagination");
exports.GetDeletedCurrency = Trackerror(async (req, res, next) => {
  const data = await CurrencyModel.findAll({
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
exports.RestoreSoftDeletedCurrency = Trackerror(async (req, res, next) => {
  const data = await CurrencyModel.findOne({
    paranoid: false,
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  let checkcode = await CurrencyModel.findOne({
    paranoid: false,
    where: { shortCode: -1 * data.shortCode },
  });
  console.log(checkcode);
  if (checkcode) {
    let [result] = await CurrencyModel.findAll({
      paranoid: false,
      attributes: [
        [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
      ],
    });
    console.log(-1 * (result.dataValues.maxshortCode + 1));
    let newcode = result.dataValues.maxshortCode + 1;
    console.log(newcode, "dsd");
    await CurrencyModel.update(
      { shortCode: newcode },
      {
        where: {
          _id: req.params.id,
        },
        paranoid: false,
      }
    );
    const restoredata = await CurrencyModel.restore({
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
      await CurrencyModel.update(
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

    const restoredata = await CurrencyModel.restore({
      where: { _id: req.params.id },
    });
    res.status(200).json({
      success: true,
      restoredata,
    });
  }
});

exports.GetCurrencyMaxShortCode = Trackerror(async (req, res, next) => {
  const data = await CurrencyModel.findAll({
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
exports.CreateCurrency = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortCode, Rate, Symbol } = req.body;

  try {
    const data = await CurrencyModel.create({
      shortCode: shortCode,
      NameEn: NameEn,
      NameAr: NameAr,
      Rate: Rate,
      Symbol: Symbol,
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
exports.CurrencyGet = Trackerror(async (req, res, next) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page - 1, size);
  const data = await CurrencyModel.findAll({
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
      // Rate: {
      //   [Op.like]: `%${req.query.Rate || ""}%`
      // },
      shortCode: {
        [Op.like]: `${req.query.shortCode || "%%"}`,
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
exports.GetCurrencyAdmin = Trackerror(async (req, res, next) => {});
exports.EditCurrency = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortCode, Rate, Symbol } = req.body;
  let data = await CurrencyModel.findOne({
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
      Rate: Rate || data.Rate,
      Symbol: Symbol || data.Symbol,
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
exports.CurrencyMassUpload = Trackerror(async (req, res, next) => {
  if (!req.files || !req.files.file) {
    res.status(404).json({ message: "File not found" });
  } else if (req.files.file.mimetype === "application/json") {
    let de = JSON.parse(req.files.file.data.toString("utf8"));
    // console.log(de);
    let original = [];
    // let ShortCodeValidation = [];
    // await de.map((data) => {
    //   ShortCodeValidation.push(data.shortCode);
    // });
    // const Duplicates = await CurrencyModel.findAll({
    //   where: {
    //     shortCode: ShortCodeValidation,
    //   },
    // });
    // if (Duplicates.length >= 1) {
    //   res.status(215).json({
    //     success: false,
    //     Notify: "Duplication Error",
    //     message: {
    //       ErrorName: "Duplication Error",
    //       list: Duplicates.map((singledup) => {
    //         return {
    //           id: singledup.BackupId,
    //           shortCode: singledup.shortCode,
    //           NameEn: singledup.NameEn,
    //           NameAr: singledup.NameAr,
    //         };
    //       }),
    //     },
    //   });
    //   res.end();
    // } else {
    await de.map((data) => {
      original.push({
        // shortCode: data.shortCode,
        NameEn: data.NameEn,
        NameAr: data.NameAr,
        DescriptionAr: data.DescriptionAr || data.NameAr,
        TitleEn: data.TitleEn || data.NameEn,
        DescriptionAr: data.DescriptionAr || data.NameAr,
        DescriptionEn: data.DescriptionEn || data.NameEn,
        BackupId: data.id,
      });
    });

    try {
      const data = await CurrencyModel.bulkCreate(original);
      // /{ validate: true }
      res.status(201).json({ success: true, data });
      // }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error,
      });
    }
  } else {
    res.status(409).json({ message: "file format is not valid" });
  }
});
exports.SoftDeleteCurrency = Trackerror(async (req, res, next) => {
  const data = await CurrencyModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  let checkcode = await CurrencyModel.findOne({
    paranoid: false,
    where: { shortCode: -data.shortCode },
  });
  console.log(checkcode);
  if (checkcode) {
    console.log("hello");
    let [result] = await CurrencyModel.findAll({
      paranoid: false,
      attributes: [
        [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
      ],
    });
    console.log(-result.dataValues.maxshortCode, "dsd");
    await CurrencyModel.update(
      { shortCode: -result.dataValues.maxshortCode },
      {
        where: {
          _id: req.params.id,
        },
      }
    );
    await CurrencyModel.destroy({
      where: { _id: req.params.id },
    });

    res.status(200).json({
      success: true,
      message: "Soft Delete Successfully",
    });
  } else {
    console.log(data.shortCode);
    await CurrencyModel.update(
      { shortCode: -data.shortCode },
      {
        where: {
          _id: req.params.id,
        },
      }
    );

    await CurrencyModel.destroy({
      where: { _id: req.params.id },
    });
    res.status(200).json({
      success: true,
      message: "Soft Delete Successfully",
    });
  }
});
