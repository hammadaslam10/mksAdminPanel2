const db = require("../config/Connection");
const TrackConditionModel = db.TrackConditionModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
exports.GetDeletedTrackCondition = Trackerror(async (req, res, next) => {
  const data = await TrackConditionModel.findAll({
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
exports.RestoreSoftDeletedTrackCondition = Trackerror(
  async (req, res, next) => {
    const data = await TrackConditionModel.findOne({
      paranoid: false,
      where: { _id: req.params.id },
    });
    if (!data) {
      return next(new HandlerCallBack("data not found", 404));
    }
    const restoredata = await TrackConditionModel.restore({
      where: { _id: req.params.id },
    });
    res.status(200).json({
      success: true,
      restoredata,
    });
  }
);

exports.GetTrackConditionMaxShortCode = Trackerror(async (req, res, next) => {
  const data = await TrackConditionModel.findAll({
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
exports.CreateTrackCondition = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortCode, AbbrevEn, AbbrevAr } = req.body;

  try {
    const data = await TrackConditionModel.create({
      shortCode: shortCode,
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
exports.TrackConditionMassUpload = Trackerror(async (req, res, next) => {
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
      const Duplicates = await TrackConditionModel.findAll({
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
            shortCode: data.shortCode,
            NameEn: data.NameEn,
            NameAr: data.NameAr,
            AbbrevEn: data.AbbrevEn || "N/A",
            AbbrevAr: data.AbbrevAr || "N/A",
            BackupId: data.id,
          });
        });

        const data = await TrackConditionModel.bulkCreate(original);
        res.status(201).json({ success: true, data });
      }
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
exports.TrackConditionGet = Trackerror(async (req, res, next) => {
  const totalcount = await TrackConditionModel.count();
  const data = await TrackConditionModel.findAll({
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
      AbbrevEn: {
        [Op.like]: `%${req.query.AbbrevEn || ""}%`,
      },
      AbbrevAr: {
        [Op.like]: `%${req.query.AbbrevAr || ""}%`,
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
  });
});
exports.GetTrackConditionAdmin = Trackerror(async (req, res, next) => {});
exports.EditTrackCondition = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortCode, AbbrevEn, AbbrevAr } = req.body;
  let data = await TrackConditionModel.findOne({
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
      AbbrevEn: AbbrevEn || data.AbbrevEn,
      AbbrevAr: AbbrevAr || data.AbbrevAr,
    };
    data = await TrackConditionModel.update(updateddata, {
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
exports.DeleteTrackCondition = Trackerror(async (req, res, next) => {
  const data = await TrackConditionModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await TrackConditionModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteTrackCondition = Trackerror(async (req, res, next) => {
  const data = await TrackConditionModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await TrackConditionModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "Soft Delete Successfully",
  });
});
