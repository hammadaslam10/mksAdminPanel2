const db = require("../config/Connection");
const EquipmentModel = db.EquipmentModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const { getPagination, getPagingData } = require("../Utils/Pagination");
exports.GetDeletedEquipment = Trackerror(async (req, res, next) => {
  const data = await EquipmentModel.findAll({
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
exports.RestoreSoftDeletedEquipment = Trackerror(async (req, res, next) => {
  const data = await EquipmentModel.findOne({
    paranoid: false,
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  let checkcode = await EquipmentModel.findOne({
    paranoid: false,
    where: { shortCode: -1 * data.shortCode },
  });
  console.log(checkcode);
  if (checkcode) {
    let [result] = await EquipmentModel.findAll({
      paranoid: false,
      attributes: [
        [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
      ],
    });
    console.log(-1 * (result.dataValues.maxshortCode + 1));
    let newcode = result.dataValues.maxshortCode + 1;
    console.log(newcode, "dsd");
    await EquipmentModel.update(
      { shortCode: newcode },
      {
        where: {
          _id: req.params.id,
        },
        paranoid: false,
      }
    );
    const restoredata = await EquipmentModel.restore({
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
      await EquipmentModel.update(
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

    const restoredata = await EquipmentModel.restore({
      where: { _id: req.params.id },
    });
    res.status(200).json({
      success: true,
      restoredata,
    });
  }
});
exports.EquipmentMassUpload = Trackerror(async (req, res, next) => {
  if (!req.files || !req.files.file) {
    res.status(404).json({ message: "File not found" });
  } else if (req.files.file.mimetype === "application/json") {
    try {
      let de = JSON.parse(req.files.file.data.toString("utf8"));
      console.log(de);
      let original = [];
      let ShortCodeValidation = [];
      await de.map((data) => {
        ShortCodeValidation.push(data.shortCode);
      });
      const Duplicates = await EquipmentModel.findAll({
        where: {
          shortCode: ShortCodeValidation,
        },
      });
      if (Duplicates.length >= 1) {
        res.status(215).json({
          success: false,
          Notify: "Duplication Error",
          message: {
            ErrorName: "Duplication Error",
            list: Duplicates.map((singledup) => {
              return {
                id: singledup.BackupId,
                shortCode: singledup.shortCode,
                NameEn: singledup.NameEn,
                NameAr: singledup.NameAr,
              };
            }),
          },
        });
        res.end();
      } else {
        await de.map((data) => {
          original.push({
            NameEn: data.NameEn,
            NameAr: data.NameAr,
            shortCode: data.shortCode,
            BackupId: data.id,
          });
        });
        console.log(original);
        const data = await EquipmentModel.bulkCreate(original, {
          ignoreDuplicates: true,
          validate: true,
        });
        res.status(201).json({ success: true, data });
      }
    } catch (error) {
      // if (error.name === "SequelizeUniqueConstraintError") {
      //   res.status(403);
      //   res.json({
      //     status: "error",
      //     message: [
      //       "This Short Code already exists, Please enter a different one.",
      //     ],
      //   });
      // } else {
      res.status(500).json({
        success: false,
        message: error.errors,
      });
      // }
    }
  } else {
    // console.log(req.files.file.mimetype);
    res.status(409).json({ message: "file format is not valid" });
  }
  // res.status(200).json({
  //   success: true,
  // });
});
exports.GetEquipmentMaxShortCode = Trackerror(async (req, res, next) => {
  const data = await EquipmentModel.findAll({
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
exports.CreateEquipment = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortCode } = req.body;

  try {
    const data = await EquipmentModel.create({
      shortCode: shortCode,
      NameEn: NameEn,
      NameAr: NameAr,
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
  // }
});
exports.EquipmentGet = Trackerror(async (req, res, next) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page - 1, size);
  const data = await EquipmentModel.findAndCountAll({
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
        message:
          err.message || "Some error occurred while retrieving Equipment.",
      });
    });
});
exports.GetEquipmentAdmin = Trackerror(async (req, res, next) => {});
exports.EditEquipment = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortCode } = req.body;
  let data = await EquipmentModel.findOne({
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
    data = await EquipmentModel.update(updateddata, {
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
exports.DeleteEquipment = Trackerror(async (req, res, next) => {
  const data = await EquipmentModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await EquipmentModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteEquipment = Trackerror(async (req, res, next) => {
  const data = await EquipmentModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  let checkcode = await EquipmentModel.findOne({
    paranoid: false,
    where: { shortCode: -data.shortCode },
  });
  console.log(checkcode);
  if (checkcode) {
    console.log("hello");
    let [result] = await EquipmentModel.findAll({
      paranoid: false,
      attributes: [
        [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
      ],
    });
    console.log(-result.dataValues.maxshortCode, "dsd");
    await EquipmentModel.update(
      { shortCode: -result.dataValues.maxshortCode },
      {
        where: {
          _id: req.params.id,
        },
      }
    );
    await EquipmentModel.destroy({
      where: { _id: req.params.id },
    });

    res.status(200).json({
      success: true,
      message: "Soft Delete Successfully",
    });
  } else {
    console.log(data.shortCode);
    await EquipmentModel.update(
      { shortCode: -data.shortCode },
      {
        where: {
          _id: req.params.id,
        },
      }
    );

    await EquipmentModel.destroy({
      where: { _id: req.params.id },
    });
    res.status(200).json({
      success: true,
      message: "Soft Delete Successfully",
    });
  }
});
