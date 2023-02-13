const db = require("../config/Connection");
const GroundTypeModel = db.GroundTypeModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const { GroundType } = require("../Utils/Path");
const { uploadFile, deleteFile } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");

const { getPagination, getPagingData } = require("../Utils/Pagination");
const e = require("express");
exports.GetDeletedGroundType = Trackerror(async (req, res, next) => {
  const data = await GroundTypeModel.findAll({
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
exports.RestoreSoftDeletedGroundType = Trackerror(async (req, res, next) => {
  const data = await GroundTypeModel.findOne({
    paranoid: false,
    where: { _id: req.params.id }
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  let checkcode = await GroundTypeModel.findOne({
    paranoid: false,
    where: { shortCode: -1 * data.shortCode }
  });
  console.log(checkcode);
  if (checkcode) {
    let [result] = await GroundTypeModel.findAll({
      paranoid: false,
      attributes: [
        [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"]
      ]
    });
    console.log(-1 * (result.dataValues.maxshortCode + 1));
    let newcode = result.dataValues.maxshortCode + 1;
    console.log(newcode, "dsd");
    await GroundTypeModel.update(
      { shortCode: newcode },
      {
        where: {
          _id: req.params.id
        },
        paranoid: false
      }
    );
    const restoredata = await GroundTypeModel.restore({
      where: { _id: req.params.id }
    });

    res.status(200).json({
      success: true,
      restoredata
    });
  } else {
    console.log("done else");
    let newcode = -1 * (data.shortCode + 1);
    console.log(newcode);
    console.log(newcode);
    try {
      await GroundTypeModel.update(
        { shortCode: newcode },
        {
          where: {
            _id: req.params.id
          },
          paranoid: false
        }
      );
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
      } else {
        res.status(500).json({
          success: false,
          message: error
        });
      }
    }

    const restoredata = await GroundTypeModel.restore({
      where: { _id: req.params.id }
    });
    res.status(200).json({
      success: true,
      restoredata
    });
  }
});

exports.GetGroundTypeMaxShortCode = Trackerror(async (req, res, next) => {
  const data = await GroundTypeModel.findAll({
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
exports.CreateGroundType = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortCode, AbbrevEn, AbbrevAr } = req.body;
  if (req.files === null) {
    try {
      const data = await GroundTypeModel.create({
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
  } else {
    const file = req.files.image;
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${GroundType}/${Image}`, file.mimetype);

    try {
      const data = await GroundTypeModel.create({
        image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${GroundType}/${Image}`,
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
  }
});
exports.GroundTypeMassUpload = Trackerror(async (req, res, next) => {
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
      const Duplicates = await GroundTypeModel.findAll({
        where: {
          shortCode: ShortCodeValidation
        }
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
                NameAr: singledup.NameAr
              };
            })
          }
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
            BackupId: data.id
          });
        });

        const data = await GroundTypeModel.bulkCreate(original);
        res.status(201).json({ success: true, data });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error
      });
    }
  } else {
    res.status(409).json({ message: "file format is not valid" });
  }
});
exports.GroundTypeGet = Trackerror(async (req, res, next) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page - 1, size);
  const counting = await GroundTypeModel.count();
  await GroundTypeModel.findAndCountAll({
    order: [[req.query.orderby || "createdAt", req.query.sequence || "DESC"]],
    where: {
      NameEn: {
        [Op.like]: `%${req.query.NameEn || "%%"}%`
      },
      NameAr: {
        [Op.like]: `%${req.query.NameAr || "%%"}%`
      },
      AbbrevEn: {
        [Op.like]: `%${req.query.AbbrevEn || "%%"}%`
      },
      AbbrevAr: {
        [Op.like]: `%${req.query.AbbrevAr || "%%"}%`
      },
      shortCode: {
        [Op.like]: `${req.query.shortCode || "%%"}`
      },
      createdAt: {
        [Op.between]: [
          req.query.startdate || "2021-12-01 00:00:00",
          req.query.endDate || "4030-12-01 00:00:00"
        ]
      }
    },
    limit,
    offset
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.status(200).json({
        data: response.data,
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalcount: response.totalcount,
        counting: counting
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
});
exports.GetGroundTypeAdmin = Trackerror(async (req, res, next) => {});
exports.EditGroundType = Trackerror(async (req, res, next) => {
  const { NameEn, NameAr, shortCode, AbbrevEn, AbbrevAr } = req.body;
  let data = await GroundTypeModel.findOne({
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
    data = await GroundTypeModel.update(updateddata, {
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
exports.DeleteGroundType = Trackerror(async (req, res, next) => {
  const data = await GroundTypeModel.findOne({
    where: { _id: req.params.id }
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await GroundTypeModel.destroy({
    where: { _id: req.params.id },
    force: true
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully"
  });
});
exports.SoftDeleteGroundType = Trackerror(async (req, res, next) => {
  const data = await GroundTypeModel.findOne({
    where: { _id: req.params.id }
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  let checkcode = await GroundTypeModel.findOne({
    paranoid: false,
    where: { shortCode: -data.shortCode }
  });
  console.log(checkcode);
  if (checkcode) {
    console.log("hello");
    let [result] = await GroundTypeModel.findAll({
      paranoid: false,
      attributes: [
        [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"]
      ]
    });
    console.log(-result.dataValues.maxshortCode, "dsd");
    await GroundTypeModel.update(
      { shortCode: -result.dataValues.maxshortCode },
      {
        where: {
          _id: req.params.id
        }
      }
    );
    await GroundTypeModel.destroy({
      where: { _id: req.params.id }
    });

    res.status(200).json({
      success: true,
      message: "Soft Delete Successfully"
    });
  } else {
    console.log(data.shortCode);
    await GroundTypeModel.update(
      { shortCode: -data.shortCode },
      {
        where: {
          _id: req.params.id
        }
      }
    );

    await GroundTypeModel.destroy({
      where: { _id: req.params.id }
    });
    res.status(200).json({
      success: true,
      message: "Soft Delete Successfully"
    });
  }
});
