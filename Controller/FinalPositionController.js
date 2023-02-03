const db = require("../config/Connection");
const FinalPositionModel = db.FinalPositionModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const sequelize = require("sequelize");
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

  let checkcode = await FinalPositionModel.findOne({
    paranoid: false,
    where: { shortCode: -1 * data.shortCode },
  });
  console.log(checkcode);
  if (checkcode) {
    let [result] = await FinalPositionModel.findAll({
      paranoid: false,
      attributes: [
        [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
      ],
    });
    console.log(-1 * (result.dataValues.maxshortCode + 1));
    let newcode = result.dataValues.maxshortCode + 1;
    console.log(newcode, "dsd");
    await FinalPositionModel.update(
      { shortCode: newcode },
      {
        where: {
          _id: req.params.id,
        },
        paranoid: false,
      }
    );
    const restoredata = await FinalPositionModel.restore({
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
      await FinalPositionModel.update(
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

    const restoredata = await FinalPositionModel.restore({
      where: { _id: req.params.id },
    });
    res.status(200).json({
      success: true,
      restoredata,
    });
  }
});
exports.FinalPositionMassUpload = Trackerror(async (req, res, next) => {
  if (!req.files || !req.files.file) {
    res.status(404).json({ message: "File not found" });
  } else if (req.files.file.mimetype === "application/json") {
    let de = JSON.parse(req.files.file.data.toString("utf8"));
    console.log(de);
    let original = [];
    // let ShortCodeValidation = [];
    // await de.map((data) => {
    //   ShortCodeValidation.push(data.shortCode);
    // });
    // const Duplicates = await FinalPositionModel.findAll({
    //   where: {
    //     shortCode: ShortCodeValidation,
    //   },
    // });
    // if (Duplicates.length >= 1) {
    // res.status(215).json({
    //   success: false,
    //   Notify: "Duplication Error",
    //   message: {
    //     ErrorName: "Duplication Error",
    //     list: Duplicates.map((singledup) => {
    //       return {
    //         id: singledup.BackupId,
    //         NameEn: singledup.NameEn,
    //         NameAr: singledup.NameAr,
    //       };
    //     }),
    //   },
    // });
    // res.end();
    // } else {
    await de.map((data, i) => {
      original.push({
        Rank: data.Rank,
        NameEn: data.NameEn || `${data.Rank}`,
        NameAr: data.NameAr || `${data.Rank}`,
        BackupId: data.id,
      });
    });

    try {
      const data = await FinalPositionModel.bulkCreate(original);
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
// exports.NationalityMassUpload = Trackerror(async (req, res, next) => {
//   if (!req.files || !req.files.file) {
//     res.status(404).json({ message: "File not found" });
//   } else if (req.files.file.mimetype === "application/json") {
//     try {
//       let de = JSON.parse(req.files.file.data.toString("utf8"));
//       console.log(de);
//       let original = [];
//       let ShortCodeValidation = [];
//       await de.map((data) => {
//         ShortCodeValidation.push(data.shortCode);
//       });
//       const Duplicates = await NationalityMod.findAll({
//         where: {
//           shortCode: ShortCodeValidation,
//         },
//       });
//       if (Duplicates.length >= 1) {
//         res.status(215).json({
//           success: false,
//           Notify: "Duplication Error",
//           message: {
//             ErrorName: "Duplication Error",
//             list: Duplicates.map((singledup) => {
//               return {
//                 id: singledup.BackupId,
//                 shortCode: singledup.shortCode,
//                 NameEn: singledup.NameEn,
//                 NameAr: singledup.NameAr,
//               };
//             }),
//           },
//         });
//         res.end();
//       } else {
//         await de.map((data) => {
//           original.push({
//             NameEn: data.NameEn,
//             NameAr: data.NameAr,
//             shortCode: data.shortCode || null,
//             AbbrevEn: data.AbbrevEn,
//             AbbrevAr: data.AbbrevAr,
//             HemisphereEn: data.HemisphereEn || null,
//             HemisphereAr: data.HemisphereAr || null,
//           });
//         });
//         console.log(original);
//         const data = await FinalPositionModel.bulkCreate(original, {
//           ignoreDuplicates: true,
//           validate: true,
//         });
//         res.status(201).json({ success: true, data });
//       }
//     } catch (error) {
//       // if (error.name === "SequelizeUniqueConstraintError") {
//       //   res.status(403);
//       //   res.json({
//       //     status: "error",
//       //     message: [
//       //       "This Short Code already exists, Please enter a different one.",
//       //     ],
//       //   });
//       // } else {
//       res.status(500).json({
//         success: false,
//         message: error.errors,
//       });
//       // }
//     }
//   } else {
//     // console.log(req.files.file.mimetype);
//     res.status(409).json({ message: "file format is not valid" });
//   }
//   // res.status(200).json({
//   //   success: true,
//   // });
// });
exports.GetFinalPositionMaxShortCode = Trackerror(async (req, res, next) => {
  const data = await FinalPositionModel.findAll({
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
exports.CreateFinalPosition = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortCode, Rank } = req.body;

  try {
    const data = await FinalPositionModel.create({
      shortCode: shortCode,
      NameEn: NameEn,
      NameAr: NameAr,
      Rank: Rank,
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
exports.FinalPositionGet = Trackerror(async (req, res, next) => {
  const totalcount = await FinalPositionModel.count();
  const data = await FinalPositionModel.findAll({
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
  });
  res.status(200).json({
    success: true,
    data: data,
    totalcount,
    filtered: data.length,
  });
});

exports.SingleFinalPosition = Trackerror(async (req, res, next) => {
  const data = await FinalPositionModel.findOne({
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
exports.GetFinalPositionAdmin = Trackerror(async (req, res, next) => {});
exports.EditFinalPosition = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortCode, Rank } = req.body;
  let data = await FinalPositionModel.findOne({
    where: { _id: req.params.id },
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const updateddata = {
    shortCode: shortCode || data.shortCode,
    NameEn: NameEn || data.NameEn,
    NameAr: NameAr || data.NameAr,
    Rank: Rank || data.Rank,
  };
  try {
    data = await FinalPositionModel.update(updateddata, {
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
  let checkcode = await FinalPositionModel.findOne({
    paranoid: false,
    where: { shortCode: -data.shortCode },
  });
  console.log(checkcode);
  if (checkcode) {
    console.log("hello");
    let [result] = await FinalPositionModel.findAll({
      paranoid: false,
      attributes: [
        [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
      ],
    });
    console.log(-result.dataValues.maxshortCode, "dsd");
    await FinalPositionModel.update(
      { shortCode: -result.dataValues.maxshortCode },
      {
        where: {
          _id: req.params.id,
        },
      }
    );
    await FinalPositionModel.destroy({
      where: { _id: req.params.id },
    });

    res.status(200).json({
      success: true,
      message: "Soft Delete Successfully",
    });
  } else {
    console.log(data.shortCode);
    await FinalPositionModel.update(
      { shortCode: -data.shortCode },
      {
        where: {
          _id: req.params.id,
        },
      }
    );

    await FinalPositionModel.destroy({
      where: { _id: req.params.id },
    });
    res.status(200).json({
      success: true,
      message: "Soft Delete Successfully",
    });
  }
});
