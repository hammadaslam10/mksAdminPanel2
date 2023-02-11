// const RaceCourseModel = require("../Models/RaceCourseModel");
const db = require("../config/Connection");
const RaceCourseModel = db.RaceCourseModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const Features = require("../Utils/Features");
const { RaceCourse, Breeder } = require("../Utils/Path");
const { uploadFile, deleteFile } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const { Op } = require("sequelize");
const { getPagination, getPagingData } = require("../Utils/Pagination");
exports.GetDeletedRaceCourse = Trackerror(async (req, res, next) => {
  const data = await RaceCourseModel.findAll({
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
exports.RestoreSoftDeletedRaceCourse = Trackerror(async (req, res, next) => {
  const data = await RaceCourseModel.findOne({
    paranoid: false,
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  let checkcode = await RaceCourseModel.findOne({
    paranoid: false,
    where: { shortCode: -1 * data.shortCode },
  });
  console.log(checkcode);
  if (checkcode) {
    let [result] = await RaceCourseModel.findAll({
      paranoid: false,
      attributes: [
        [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
      ],
    });
    console.log(-1 * (result.dataValues.maxshortCode + 1));
    let newcode = result.dataValues.maxshortCode + 1;
    console.log(newcode, "dsd");
    await RaceCourseModel.update(
      { shortCode: newcode },
      {
        where: {
          _id: req.params.id,
        },
        paranoid: false,
      }
    );
    const restoredata = await RaceCourseModel.restore({
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
      await RaceCourseModel.update(
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

    const restoredata = await RaceCourseModel.restore({
      where: { _id: req.params.id },
    });
    res.status(200).json({
      success: true,
      restoredata,
    });
  }
});

exports.GetCourse = Trackerror(async (req, res, next) => {
  const data = await RaceCourseModel.findAll({
    include: [
      {
        model: db.NationalityModel,
        as: "NationalityDataRaceCourse",
        paranoid: false,
      },
      {
        model: db.ColorModel,
        as: "ColorCodeData",
      },
      {
        model: db.RaceModel,
        as: "RaceCourseData",
        include: { all: true },
      },
    ],
  });
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.SingleRaceCourse = Trackerror(async (req, res, next) => {
  const data = await RaceCourseModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return new next("horse is not available", 404);
  } else {
    res.status(200).json({
      success: true,
      data,
    });
  }
});
exports.SearchRaceCourse = Trackerror(async (req, res, next) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page - 1, size);
  await RaceCourseModel.findAndCountAll({
    order: [[req.query.orderby || "createdAt", req.query.sequence || "ASC"]],
    include: { all: true },
    where: {
      // TrackNameEn: {
      //   [Op.like]: `%${req.query.TrackNameEn || ""}%`,
      // },
      // TrackNameAr: {
      //   [Op.like]: `%${req.query.TrackNameAr || ""}%`,
      // },
      shortCode: {
        [Op.like]: `${req.query.shortCode || "%%"}`,
      },
      NationalityID: {
        [Op.like]: `${req.query.NationalityID || "%%"}`,
      },
      ColorCode: {
        [Op.like]: `${req.query.ColorCode || "%%"}`,
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
exports.CreateRaceCourse = Trackerror(async (req, res, next) => {
  const {
    TrackNameAr,
    TrackNameEn,
    shortCode,
    NationalityID,
    ColorCode,
    AbbrevAr,
    AbbrevEn,
  } = req.body;

  if (req.files === null) {
    try {
      const data = await RaceCourseModel.create({
        TrackNameAr: TrackNameAr,
        TrackNameEn: TrackNameEn,
        ColorCode: ColorCode,
        NationalityID: NationalityID,
        shortCode: shortCode,
        AbbrevAr: AbbrevAr,
        AbbrevEn: AbbrevEn,
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
  } else {
    try {
      const file = req.files.image;
      let Image = generateFileName();
      const fileBuffer = await resizeImageBuffer(
        req.files.image.data,
        214,
        212
      );
      await uploadFile(fileBuffer, `${RaceCourse}/${Image}`, file.mimetype);
      const data = await RaceCourseModel.create({
        image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${RaceCourse}/${Image}`,
        TrackNameAr: TrackNameAr,
        TrackNameEn: TrackNameEn,
        ColorCode: ColorCode,
        NationalityID: NationalityID,
        shortCode: shortCode,
        AbbrevAr: AbbrevAr,
        AbbrevEn: AbbrevEn,
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
  }
});
exports.RaceCourseMassUpload = Trackerror(async (req, res, next) => {
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
      const Duplicates = await RaceCourseModel.findAll({
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
        console.log(Duplicates);
        await de.map((data) => {
          original.push({
            ColorCode: data.ColorCode,
            shortCode: data.shortCode,
            TrackNameEn: data.TrackNameEn || data.NameEn,
            NationalityID: "ed101126-1ddc-4b87-819f-b7c15da7a3be",
            ColorCode: "ebb8cd80-2852-4666-a047-ec39a3dbd9ee",
            TrackNameAr: data.TrackNameAr || data.NameAr,
            NameEn: data.NameEn,
            NameAr: data.NameAr,
            BackupId: data.id,
          });
        });
        const data = await RaceCourseModel.bulkCreate(original, {
          // ignoreDuplicates: true,
          // validate: true,
        });
        res.status(201).json({ success: true, data });
      }
    } catch (error) {
      res.status(210).json({
        success: false,
        message: error,
      });
    }
  } else {
    res.status(409).json({ message: "file format is not valid" });
  }
});
exports.UpdateCourse = Trackerror(async (req, res, next) => {
  const {
    TrackNameAr,
    TrackNameEn,
    shortCode,
    NationalityID,
    ColorCode,
    AbbrevAr,
    AbbrevEn,
  } = req.body;
  let data = await RaceCourseModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  try {
    const updateddata = {
      shortCode: shortCode || data.shortCode,
      TrackNameAr: TrackNameAr || data.TrackNameAr,
      TrackNameEn: TrackNameEn || data.TrackNameEn,
      ColorCode: ColorCode || data.ColorCode,
      NationalityID: NationalityID || data.NationalityID,
      AbbrevAr: AbbrevAr || data.AbbrevAr,
      AbbrevEn: AbbrevEn || data.AbbrevEn,
    };
    data = await RaceCourseModel.update(updateddata, {
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
exports.DeleteCourse = Trackerror(async (req, res, next) => {
  const data = await RaceCourseModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);
  await RaceCourseModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  await deleteFile(`${RaceCourse}/${data.image.slice(-64)}`);
  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteCourse = Trackerror(async (req, res, next) => {
  const data = await RaceCourseModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  let checkcode = await RaceCourseModel.findOne({
    paranoid: false,
    where: { shortCode: -data.shortCode },
  });
  console.log(checkcode);
  if (checkcode) {
    console.log("hello");
    let [result] = await RaceCourseModel.findAll({
      paranoid: false,
      attributes: [
        [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
      ],
    });
    console.log(-result.dataValues.maxshortCode, "dsd");
    await RaceCourseModel.update(
      { shortCode: -result.dataValues.maxshortCode },
      {
        where: {
          _id: req.params.id,
        },
      }
    );
    await RaceCourseModel.destroy({
      where: { _id: req.params.id },
    });

    res.status(200).json({
      success: true,
      message: "Soft Delete Successfully",
    });
  } else {
    console.log(data.shortCode);
    await RaceCourseModel.update(
      { shortCode: -data.shortCode },
      {
        where: {
          _id: req.params.id,
        },
      }
    );

    await RaceCourseModel.destroy({
      where: { _id: req.params.id },
    });
    res.status(200).json({
      success: true,
      message: "Soft Delete Successfully",
    });
  }
});
