const db = require("../config/Connection");
const NationalityModel = db.NationalityModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { Nationality } = require("../Utils/Path");
const { uploadFile, deleteFile } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
exports.GetDeletedNationality = Trackerror(async (req, res, next) => {
  const data = await NationalityModel.findAll({
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
exports.RestoreSoftDeletedNationality = Trackerror(async (req, res, next) => {
  const data = await NationalityModel.findOne({
    paranoid: false,
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const restoredata = await NationalityModel.restore({
    where: { _id: req.params.id },
  });
  res.status(200).json({
    success: true,
    restoredata,
  });
});

exports.GetNationalityMaxShortCode = Trackerror(async (req, res, next) => {
  const data = await NationalityModel.findAll({
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
exports.CreateNationality = Trackerror(async (req, res, next) => {
  const {
    NameEn,
    NameAr,
    AbbrevEn,
    AltNameEn,
    LabelEn,
    Offset,
    ValueAr,
    shortCode,
    AltNameAr,
    ValueEn,
    AbbrevAr,
    LabelAr,
    HemisphereEn,
    HemisphereAr,
  } = req.body;
  if (req.file == null) {
    try {
      const data = await NationalityModel.create({
        AbbrevEn: AbbrevEn,
        AbbrevAr: AbbrevAr,
        shortCode: shortCode,
        AltNameEn: AltNameEn,
        AltNameAr: AltNameAr,
        LabelEn: LabelEn,
        Offset: Offset,
        ValueAr: ValueAr,
        ValueEn: ValueEn,
        NameEn: NameEn,
        NameAr: NameAr,
        LabelAr: LabelAr,
        HemisphereEn: HemisphereEn,
        HemisphereAr: HemisphereAr,
      });
      res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        res.status(403);
        res.send({
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
      const Image = generateFileName();
      const fileBuffer = await resizeImageBuffer(
        req.files.image.data,
        214,
        212
      );
      await uploadFile(fileBuffer, `${Nationality}/${Image}`, file.mimetype);
      const data = await NationalityModel.create({
        image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Nationality}/${Image}`,
        AbbrevEn: AbbrevEn,
        AbbrevAr: AbbrevAr,
        shortCode: shortCode,
        AltNameEn: AltNameEn,
        AltNameAr: AltNameAr,
        LabelEn: LabelEn,
        Offset: Offset,
        ValueAr: ValueAr,
        ValueEn: ValueEn,
        NameEn: NameEn,
        NameAr: NameAr,
        LabelAr: LabelAr,
        HemisphereEn: HemisphereEn,
        HemisphereAr: HemisphereAr,
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
exports.NationalityMassUpload = Trackerror(async (req, res, next) => {
  if (!req.files || !req.files.file) {
    res.status(404).json({ message: "File not found" });
  } else if (req.files.file.mimetype === "application/json") {
    try {
      let de = JSON.parse(req.files.file.data.toString("utf8"));
      console.log(de);
      let original = [];
      await de.map((data) => {
        original.push({
          NameEn: data.NameEn,
          NameAr: data.NameAr,
          AltNameEn: data.AltNameEn || data.NameEn,
          AltNameAr: data.AltNameAr || data.NameAr,
          shortCode: data.shortCode,
          AbbrevEn: data.AbbrevEn || data.NameEn,
          AbbrevAr: data.AbbrevAr || data.NameAr,
          HemisphereEn: data.HemisphereEn,
          HemisphereAr: data.HemisphereAr,
          BackupId: data.id,
        });
      });
      // console.log(original);
      const data = await NationalityModel.bulkCreate(original);
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
        message: error,
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
exports.NationalityGet = Trackerror(async (req, res, next) => {
  const totalcount = await NationalityModel.count();
  const data = await NationalityModel.findAll({
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
      AltNameEn: {
        [Op.like]: `%${req.query.AltNameEn || ""}%`,
      },
      AltNameAr: {
        [Op.like]: `%${req.query.AltNameAr || ""}%`,
      },
      HemisphereEn: {
        [Op.like]: `%${req.query.HemisphereEn || ""}%`,
      },
      HemisphereAr: {
        [Op.like]: `%${req.query.HemisphereAr || ""}%`,
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
    totalcount,
    filtered: data.length,
  });
});
exports.GetNationalityAdmin = Trackerror(async (req, res, next) => {});
exports.EditNationality = Trackerror(async (req, res, next) => {
  const {
    NameEn,
    NameAr,
    AbbrevEn,
    AltNameEn,
    AltNameAr,
    LabelEn,
    Offset,
    ValueAr,
    ValueEn,
    shortCode,
    AbbrevAr,
    LabelAr,
    HemisphereEn,
    HemisphereAr,
  } = req.body;
  let data = await NationalityModel.findOne({
    where: { _id: req.params.id },
  });

  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  if (req.files == null) {
    const updateddata = {
      image: data.image,
      AbbrevEn: AbbrevEn || data.AbbrevEn,
      AltNameEn: AltNameEn || data.AltNameEn,
      shortCode: shortCode || data.shortCode,
      LabelEn: LabelEn || data.LabelEn,
      Offset: Offset || data.Offset,
      NameEn: NameEn || data.NameEn,
      NameAr: NameAr || data.NameAr,
      ValueAr: ValueAr || data.ValueAr,
      ValueEn: ValueEn || data.ValueEn,
      AbbrevAr: AbbrevAr || data.AbbrevAr,
      AltNameAr: AltNameAr || data.AltNameAr,
      LabelAr: LabelAr || data.LabelAr,
      HemisphereEn: HemisphereEn || data.HemisphereEn,
      HemisphereAr: HemisphereAr || data.HemisphereEn,
    };
    try {
      data = await NationalityModel.update(updateddata, {
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
        res.send({
          status: "error",
          message:
            "This Short Code already exists, Please enter a different one.",
        });
      }
    }
  } else {
    const file = req.files.image;
    await deleteFile(`${Nationality}/${data.image}`);
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${Nationality}/${Image}`, file.mimetype);
    const updateddata = {
      image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Nationality}/${Image}`,
      AbbrevEn: AbbrevEn || data.AbbrevEn,
      AltNameEn: AltNameEn || data.AltNameEn,
      shortCode: shortCode || data.shortCode,
      LabelEn: LabelEn || data.LabelEn,
      Offset: Offset || data.Offset,
      NameEn: NameEn || data.NameEn,
      NameAr: NameAr || data.NameAr,
      ValueAr: ValueAr || data.ValueAr,
      AltNameAr: AltNameAr || data.AltNameAr,
      LabelAr: LabelAr || data.LabelAr,
      HemisphereEn: HemisphereEn || data.HemisphereEn,
      HemisphereAr: HemisphereAr || data.HemisphereEn,
    };
    try {
      data = await NationalityModel.update(updateddata, {
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
        res.send({
          status: "error",
          message:
            "This Short Code already exists, Please enter a different one.",
        });
      }
    }
  }
});
exports.DeleteNationality = Trackerror(async (req, res, next) => {
  const data = await NationalityModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);
  await deleteFile(`${Nationality}/${data.image.slice(-64)}`);
  await NationalityModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteNationality = Trackerror(async (req, res, next) => {
  const data = await NationalityModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await NationalityModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "Soft Delete Successfully",
  });
});
