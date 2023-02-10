const db = require("../config/Connection");
const TrainerModel = db.TrainerModel;
const NationalityModel = db.NationalityModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { Trainer, Breeder } = require("../Utils/Path");
const { uploadFile, deleteFile, getObjectSignedUrl } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const Features = require("../Utils/Features");
const { Op } = require("sequelize");
const { sequelize } = require("sequelize");
const { getPagination, getPagingData } = require("../Utils/Pagination");
exports.GetDeletedTrainer = Trackerror(async (req, res, next) => {
  const data = await TrainerModel.findAll({
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
exports.RestoreSoftDeletedTrainer = Trackerror(async (req, res, next) => {
  const data = await ColorModel.findOne({
    paranoid: false,
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  let checkcode = await ColorModel.findOne({
    paranoid: false,
    where: { shortCode: -1 * data.shortCode },
  });
  console.log(checkcode);
  if (checkcode) {
    let [result] = await ColorModel.findAll({
      paranoid: false,
      attributes: [
        [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
      ],
    });
    console.log(-1 * (result.dataValues.maxshortCode + 1));
    let newcode = result.dataValues.maxshortCode + 1;
    console.log(newcode, "dsd");
    await ColorModel.update(
      { shortCode: newcode },
      {
        where: {
          _id: req.params.id,
        },
        paranoid: false,
      }
    );
    const restoredata = await ColorModel.restore({
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
      await ColorModel.update(
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

    const restoredata = await ColorModel.restore({
      where: { _id: req.params.id },
    });
    res.status(200).json({
      success: true,
      restoredata,
    });
  }
});
exports.SearchTrainer = Trackerror(async (req, res, next) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page - 1, size);
  await TrainerModel.findAndCountAll({
    offset: Number(req.query.page) - 1 || 0,
    limit: Number(req.query.limit) || 10,
    order: [[req.query.orderby || "createdAt", req.query.sequence || "ASC"]],
    include: { all: true },
    where: {
      NameEn: {
        [Op.like]: `%${req.query.NameEn || ""}%`,
      },
      NameAr: {
        [Op.like]: `%${req.query.NameAr || ""}%`,
      },
      ShortNameEn: {
        [Op.like]: `%${req.query.ShortNameEn || ""}%`,
      },
      ShortNameAr: {
        [Op.like]: `%${req.query.ShortNameAr || ""}%`,
      },
      DetailEn: {
        [Op.like]: `%${req.query.DetailEn || ""}%`,
      },
      RemarksEn: {
        [Op.like]: `%${req.query.RemarksEn || ""}%`,
      },
      RemarksAr: {
        [Op.like]: `%${req.query.RemarksAr || ""}%`,
      },
      DetailAr: {
        [Op.like]: `%${req.query.DetailAr || ""}%`,
      },
      TitleEn: {
        [Op.like]: `%${req.query.TitleEn || ""}%`,
      },
      TitleAr: {
        [Op.like]: `%${req.query.TitleAr || ""}%`,
      },
      // DOB: {
      //   [Op.like]: `%${req.query.DOB || ""}%`,
      // },
      NationalityID: {
        [Op.like]: `%${req.query.NationalityID || ""}%`,
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
function exchangefunction(arraytobechecked, valuetobechecked) {
  let a = arraytobechecked.find((item) => item.BackupId == valuetobechecked);
  console.log(a._id, "hello");
  return a._id;
}
exports.TrainerDropDown = Trackerror(async (req, res, next) => {
  const data = await TrainerModel.findAll({
    offset: Number(req.query.page) - 1 || 0,
    limit: Number(req.query.limit) || 10,
    order: [[req.query.orderby || "createdAt", req.query.sequence || "ASC"]],
    attributes: ["NameEn", "NameAr", "_id"],
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
    },
  });
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.TrainerMassUpload = Trackerror(async (req, res, next) => {
  if (!req.files || !req.files.file) {
    res.status(404).json({ message: "File not found" });
  } else if (req.files.file.mimetype === "application/json") {
    // try {
    let de = JSON.parse(req.files.file.data.toString("utf8"));
    let tempnationality;
    let original = [];
    let data;
    let ShortCodeValidation = [];
    await de.map((data) => {
      ShortCodeValidation.push(data.shortCode);
    });
    const Duplicates = await TrainerModel.findAll({
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
      let nationalforeignkeys = Array.from(
        new Set(de.map((item) => item.NationalityID))
      );
      console.log(nationalforeignkeys.length);
      console.log(nationalforeignkeys);
      tempnationality = await NationalityModel.findAll({
        where: { BackupId: nationalforeignkeys },
        attributes: ["_id", "BackupId"],
      });
      nationalforeignkeys = [];

      tempnationality.map((newdata) => {
        nationalforeignkeys.push({
          _id: newdata._id,
          BackupId: newdata.BackupId,
        });
      });
      let temp;
      // console.log(nationalforeignkeys);
      for (let i = 0; i < de.length; i++) {
        temp = exchangefunction(nationalforeignkeys, de[i].NationalityID);
        console.log(temp, "temp");
        original.push({
          NameEn: de[i].NameEn,
          NameAr: de[i].NameAr,
          ShortNameEn: de[i].ShortNameEn,
          ShortNameAr: de[i].ShortNameAr,
          TitleEn: de[i].TitleEn || de[i].NameEn,
          TitleAr: de[i].TitleAr || de[i].NameAr,
          TrainerLicenseDate: de[i].TrainerLicenseDate || Date.now,
          DOB: de[i].DOB || de[i].TrainerLicenseDate,
          shortCode: de[i].shortCode || null,
          DetailEn: de[i].DetailEn || de[i].NameEn,
          RemarksEn: de[i].RemarksEn || de[i].NameEn,
          Rating: de[i].Rating || 0,
          NationalityID: temp,
          DetailAr: de[i].DetailAr || de[i].NameAr,
          RemarksAr: de[i].RemarksAr || de[i].NameEn,
          BackupId: de[i].id,
        });
      }

      // console.log(original);
      const db = await TrainerModel.bulkCreate(original);
      // , {
      //   ignoreDuplicates: true,
      //   validate: true
      // }
      res.status(200).json({
        success: true,
        db,
      });
    }
    // } catch (err) {
    //   res.status(500).json({
    //     success: false,
    //     message: err
    //   });
    // }
  } else {
    res.status(409).json({ message: "file format is not valid" });
  }
});
exports.GetTrainer = Trackerror(async (req, res, next) => {
  const data = await TrainerModel.findAll({
    include: { all: true },
  });
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.CreateTrainer = Trackerror(async (req, res, next) => {
  const {
    NameEn,
    NameAr,
    TitleEn,
    TitleAr,
    DOB,
    TrainerLicenseDate,
    ShortNameEn,
    ShortNameAr,
    DetailEn,
    RemarksEn,
    NationalityID,
    Rating,
    DetailAr,
    RemarksAr,
  } = req.body;
  if (req.files === null) {
    try {
      const data = await TrainerModel.create({
        NameEn: NameEn,
        NameAr: NameAr,
        ShortNameEn: ShortNameEn,
        ShortNameAr: ShortNameAr,
        TitleEn: TitleEn,
        TitleAr: TitleAr,
        TrainerLicenseDate: TrainerLicenseDate,
        DOB: DOB,
        DetailEn: DetailEn,
        RemarksEn: RemarksEn,
        Rating: Rating,
        NationalityID: NationalityID,
        DetailAr: DetailAr,
        RemarksAr: RemarksAr,
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
  const file = req.files.image;
  const Image = generateFileName();
  const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
  await uploadFile(fileBuffer, `${Trainer}/${Image}`, file.mimetype);

  const data = await TrainerModel.create({
    image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Trainer}/${Image}`,
    NameEn: NameEn,
    NameAr: NameAr,
    ShortNameEn: ShortNameEn,
    ShortNameAr: ShortNameAr,
    TitleEn: TitleEn,
    TitleAr: TitleAr,
    TrainerLicenseDate: TrainerLicenseDate,
    DOB: DOB,
    DetailEn: DetailEn,
    RemarksEn: RemarksEn,
    Rating: Rating,
    NationalityID: NationalityID,
    DetailAr: DetailAr,
    RemarksAr: RemarksAr,
  });

  res.status(201).json({
    success: true,
    data,
  });
});
exports.UpdateTrainer = Trackerror(async (req, res, next) => {
  const {
    NameEn,
    NameAr,
    TitleEn,
    TitleAr,
    DOB,
    TrainerLicenseDate,
    ShortNameEn,
    ShortNameAr,
    DetailEn,
    RemarksEn,
    Rating,
    NationalityID,
    DetailAr,
    RemarksAr,
  } = req.body;
  let data = await TrainerModel.findOne({
    where: { _id: req.params.id },
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  if (req.files == null) {
    const updateddata = {
      image: data.image,
      NameEn: NameEn || data.NameEn,
      NameAr: NameAr || data.NameAr,
      ShortNameEn: ShortNameEn || data.ShortNameEn,
      ShortNameAr: ShortNameAr || data.ShortNameAr,
      TitleEn: TitleEn || data.TitleEn,
      TitleAr: TitleAr || data.TitleAr,
      TrainerLicenseDate: TrainerLicenseDate || data.TrainerLicenseDate,
      DOB: DOB || data.DOB,
      DetailEn: DetailEn || data.DetailEn,
      RemarksEn: RemarksEn || data.RemarksEn,
      Rating: Rating || data.Rating,
      NationalityID: NationalityID || data.NationalityID,
      DetailAr: DetailAr || data.DetailAr,
      RemarksAr: RemarksAr || data.RemarksAr,
    };
    data = await TrainerModel.update(updateddata, {
      where: {
        _id: req.params.id,
      },
    });
    res.status(200).json({
      success: true,
      data,
    });
  } else {
    const file = req.files.image;
    await deleteFile(`${Trainer}/${data.image}`);
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${Trainer}/${Image}`, file.mimetype);

    const updateddata = {
      image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Trainer}/${Image}`,
      NameEn: NameEn || data.NameEn,
      NameAr: NameAr || data.NameAr,
      ShortNameEn: ShortNameEn || data.ShortNameEn,
      ShortNameAr: ShortNameAr || data.ShortNameAr,
      TitleEn: TitleEn || data.TitleEn,
      TitleAr: TitleAr || data.TitleAr,
      TrainerLicenseDate: TrainerLicenseDate || data.TrainerLicenseDate,
      DOB: DOB || data.DOB,
      DetailEn: DetailEn || data.DetailEn,
      RemarksEn: RemarksEn || data.RemarksEn,
      Rating: Rating || data.Rating,
      RemarksAr: RemarksAr || data.RemarksAr,
    };
    data = await TrainerModel.update(updateddata, {
      where: {
        _id: req.params.id,
      },
    });
    res.status(200).json({
      success: true,
      data,
    });
  }
});
exports.SingleTrainer = Trackerror(async (req, res, next) => {
  let data = await TrainerModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return new next("Trainer is not available", 404);
  } else {
    res.status(200).json({
      success: true,
      data,
    });
  }
});
exports.DeleteTrainer = Trackerror(async (req, res, next) => {
  const data = await TrainerModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);
  await deleteFile(`${Trainer}/${data.image.slice(-64)}`);
  await TrainerModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteTrainer = Trackerror(async (req, res, next) => {
  const data = await TrainerModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  let checkcode = await TrainerModel.findOne({
    paranoid: false,
    where: { shortCode: -data.shortCode },
  });
  console.log(checkcode);
  if (checkcode) {
    console.log("hello");
    let [result] = await TrainerModel.findAll({
      paranoid: false,
      attributes: [
        [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
      ],
    });
    console.log(-result.dataValues.maxshortCode, "dsd");
    await TrainerModel.update(
      { shortCode: -result.dataValues.maxshortCode },
      {
        where: {
          _id: req.params.id,
        },
      }
    );
    await TrainerModel.destroy({
      where: { _id: req.params.id },
    });

    res.status(200).json({
      success: true,
      message: "Soft Delete Successfully",
    });
  } else {
    console.log(data.shortCode);
    await TrainerModel.update(
      { shortCode: -data.shortCode },
      {
        where: {
          _id: req.params.id,
        },
      }
    );

    await TrainerModel.destroy({
      where: { _id: req.params.id },
    });
    res.status(200).json({
      success: true,
      message: "Soft Delete Successfully",
    });
  }
});
