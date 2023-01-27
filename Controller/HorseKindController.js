const db = require("../config/Connection");
const HorseKindModel = db.HorseKindModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const { Op } = require("sequelize");
exports.GetDeletedHorseKind = Trackerror(async (req, res, next) => {
  const data = await HorseKindModel.findAll({
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

exports.HorseKindMassUpload = Trackerror(async (req, res, next) => {
  if (!req.files || !req.files.file) {
    res.status(404).json({ message: "File not found" });
  } else if (req.files.file.mimetype === "application/json") {
    let de = JSON.parse(req.files.file.data.toString("utf8"));
    console.log(de);
    let original = [];
    // let ShortCodeValidation = [];
    //   await de.map((data) => {
    //     ShortCodeValidation.push(data.shortCode);
    //   });
    //   const Duplicates = await HorseKindModel.findAll({
    //     where: {
    //       shortCode: ShortCodeValidation,
    //     },
    //   });
    //   if (Duplicates.length >= 1) {
    //     res.status(215).json({
    //       success: false,
    //       Notify: "Duplication Error",
    //       message: {
    //         ErrorName: "Duplication Error",
    //         list: Duplicates.map((singledup) => {
    //           return {
    //             id: singledup.BackupId,
    //             shortCode: singledup.shortCode,
    //             NameEn: singledup.NameEn,
    //             NameAr: singledup.NameAr,
    //           };
    //         }),
    //       },
    //     });
    //     res.end();
    //   } else {
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
    try {
      const data = await HorseKindModel.bulkCreate(original, {
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
    // }
  } else {
    // console.log(req.files.file.mimetype);
    res.status(409).json({ message: "file format is not valid" });
  }
  // res.status(200).json({
  //   success: true,
  // });
});

exports.RestoreSoftDeletedHorseKind = Trackerror(async (req, res, next) => {
  const data = await HorseKindModel.findOne({
    paranoid: false,
    where: { _id: req.params.id }
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const restoredata = await HorseKindModel.restore({
    where: { _id: req.params.id }
  });
  res.status(200).json({
    success: true,
    restoredata
  });
});

exports.CreateHorseKind = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortName, AbbrevEn, AbbrevAr } = req.body;
  try {
    const data = await HorseKindModel.create({
      shortName: shortName,
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
      })
    });
  }
});
exports.HorseKindGet = Trackerror(async (req, res, next) => {
  const totalcount = await HorseKindModel.count();
  const data = await HorseKindModel.findAll({
    offset: Number(req.query.page) - 1 || 0,
    limit: Number(req.query.limit) || 10,
    order: [[req.query.orderby || "createdAt", req.query.sequence || "ASC"]],
    where: {
      NameEn: {
        [Op.like]: `%${req.query.NameEn || ""}%`
      },
      NameAr: {
        [Op.like]: `%${req.query.NameAr || ""}%`
      },
      AbbrevEn: {
        [Op.like]: `%${req.query.AbbrevEn || ""}%`
      },
      AbbrevAr: {
        [Op.like]: `%${req.query.AbbrevAr || ""}%`
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
    data: data,
    totalcount,
    filtered: data.length
  });
});
exports.GetHorseKindAdmin = Trackerror(async (req, res, next) => {});
exports.EditHorseKind = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortName, AbbrevEn, AbbrevAr } = req.body;
  let data = await HorseKindModel.findOne({
    where: { _id: req.params.id }
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const updateddata = {
    shortName: shortName || data.shortName,
    NameEn: NameEn || data.NameEn,
    NameAr: NameAr || data.NameAr,
    AbbrevEn: AbbrevEn || data.AbbrevEn,
    AbbrevAr: AbbrevAr || data.AbbrevAr
  };
  data = await HorseKindModel.update(updateddata, {
    where: {
      _id: req.params.id
    }
  });
  res.status(200).json({
    success: true,
    data
  });
});
exports.DeleteHorseKind = Trackerror(async (req, res, next) => {
  const data = await HorseKindModel.findOne({
    where: { _id: req.params.id }
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await HorseKindModel.destroy({
    where: { _id: req.params.id },
    force: true
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully"
  });
});
exports.SoftDeleteHorseKind = Trackerror(async (req, res, next) => {
  const data = await HorseKindModel.findOne({
    where: { _id: req.params.id }
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await HorseKindModel.destroy({
    where: { _id: req.params.id }
  });

  res.status(200).json({
    success: true,
    message: "Soft Delete Successfully"
  });
});
