const db = require("../config/Connection");
const SexModel = db.SexModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
exports.GetDeletedSex = Trackerror(async (req, res, next) => {
  const data = await SexModel.findAll({
    paranoid: false,
    where: {
      [Op.not]: { deletedAt: null }
    }
  });
  res.status(200).json({
    success: true,
    data
  });
});
exports.SexMassUpload = Trackerror(async (req, res, next) => {
  if (!req.files || !req.files.file) {
    res.status(404).json({ message: "File not found" });
  } else if (req.files.file.mimetype === "application/json") {
    try {
      let de = JSON.parse(req.files.file.data.toString("utf8"));
      console.log(de);
      let original = [];
      await de.map((data) => {
        original.push({
          AbbrevEn: data.AbbrevEn,
          AbbrevAr: data.AbbrevAr,
          shortCode: data.shortCode,
          NameEn: data.NameEn,
          NameAr: data.NameAr,
          BackupId: data.id
        });
      });
      const data = await SexModel.bulkCreate(original, {
        ignoreDuplicates: true,
        validate: true
      });
      res.status(201).json({ success: true, data });
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
        message: error.errors
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

exports.RestoreSoftDeletedSex = Trackerror(async (req, res, next) => {
  const data = await SexModel.findOne({
    paranoid: false,
    where: { _id: req.params.id }
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const restoredata = await SexModel.restore({
    where: { _id: req.params.id }
  });
  res.status(200).json({
    success: true,
    restoredata
  });
});

exports.GetSexMaxShortCode = Trackerror(async (req, res, next) => {
  const data = await SexModel.findAll({
    paranoid: false,
    attributes: [
      [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"]
    ]
  });
  res.status(200).json({
    success: true,
    data
  });
});
exports.CreateSex = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortCode, AbbrevEn, AbbrevAr } = req.body;

  try {
    const data = await SexModel.create({
      shortCode: shortCode,
      NameEn: NameEn,
      NameAr: NameAr,
      AbbrevEn: AbbrevEn,
      AbbrevAr: AbbrevAr
    });
    res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(403);
      res.json({
        status: "error",
        message: [
          "This Short Code already exists, Please enter a different one."
        ]
      });
    } else {
      res.status(500).json({
        success: false,
        message: error.errors.map((singleerr) => {
          return singleerr.message;
        })
      });
    }
  }
});
exports.SexGet = Trackerror(async (req, res, next) => {
  const data = await SexModel.findAll({
    offset: Number(req.query.page) || 0,
    limit: Number(req.query.limit) || 10,
    order: [[req.query.orderby || "createdAt", req.query.sequence || "ASC"]],
    where: {
      NameEn: {
        [Op.like]: `%${req.query.NameEn || ""}%`
      },
      NameAr: {
        [Op.like]: `%${req.query.NameAr || ""}%`
      },
      // DescriptionEn: {
      //   [Op.like]: `%${req.query.DescriptionEn || ""}%`,
      // },
      // DescriptionAr: {
      //   [Op.like]: `%${req.query.DescriptionAr || ""}%`,
      // },
      shortCode: {
        [Op.like]: `%${req.query.shortCode || ""}%`
      },
      createdAt: {
        [Op.between]: [
          req.query.startdate || "2021-12-01 00:00:00",
          req.query.endDate || "4030-12-01 00:00:00"
        ]
      }
    }
  });
  res.status(200).json({
    success: true,
    data: data
  });
});
exports.GetSexAdmin = Trackerror(async (req, res, next) => {});
exports.EditSex = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortCode, AbbrevEn, AbbrevAr } = req.body;
  let data = await SexModel.findOne({
    where: { _id: req.params.id }
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
      AbbrevAr: AbbrevAr || data.AbbrevAr
    };
    data = await SexModel.update(updateddata, {
      where: {
        _id: req.params.id
      }
    });
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(403);
      res.json({
        status: "error",
        message: [
          "This Short Code already exists, Please enter a different one."
        ]
      });
    } else {
      res.status(500).json({
        success: false,
        message: error.errors.map((singleerr) => {
          return singleerr.message;
        })
      });
    }
  }
});
exports.DeleteSex = Trackerror(async (req, res, next) => {
  const data = await SexModel.findOne({
    where: { _id: req.params.id }
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await SexModel.destroy({
    where: { _id: req.params.id },
    force: true
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully"
  });
});
exports.SoftDeleteSex = Trackerror(async (req, res, next) => {
  const data = await SexModel.findOne({
    where: { _id: req.params.id }
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await SexModel.destroy({
    where: { _id: req.params.id }
  });

  res.status(200).json({
    success: true,
    message: "Soft Delete Successfully"
  });
});
