const db = require("../config/Connection");
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const OwnerModel = db.OwnerModel;
const NationalityModel = db.NationalityModel;
const { uploadFile, deleteFile, getObjectSignedUrl } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const { Owner, Breeder, OwnerSilk, OwnerCap } = require("../Utils/Path");
const Features = require("../Utils/Features");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const { Conversion } = require("../Utils/Conversion");
const OwnerSilkColorModel = db.OwnerSilkColorModel;
const OwnerCapModel = db.OwnerCapModel;
const { Op } = require("sequelize");
const { getPagination, getPagingData } = require("../Utils/Pagination");
exports.GetDeletedOwner = Trackerror(async (req, res, next) => {
  const data = await OwnerModel.findAll({
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
exports.RestoreSoftDeletedOwner = Trackerror(async (req, res, next) => {
  const data = await OwnerModel.findOne({
    paranoid: false,
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  let checkcode = await OwnerModel.findOne({
    paranoid: false,
    where: { shortCode: -1 * data.shortCode },
  });
  console.log(checkcode);
  if (checkcode) {
    let [result] = await OwnerModel.findAll({
      paranoid: false,
      attributes: [
        [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
      ],
    });
    console.log(-1 * (result.dataValues.maxshortCode + 1));
    let newcode = result.dataValues.maxshortCode + 1;
    console.log(newcode, "dsd");
    await OwnerModel.update(
      { shortCode: newcode },
      {
        where: {
          _id: req.params.id,
        },
        paranoid: false,
      }
    );
    const restoredata = await OwnerModel.restore({
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
      await OwnerModel.update(
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

    const restoredata = await OwnerModel.restore({
      where: { _id: req.params.id },
    });
    res.status(200).json({
      success: true,
      restoredata,
    });
  }
});
exports.OwnerDropDown = Trackerror(async (req, res, next) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page - 1, size);
  await OwnerModel.findAndCountAll({
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
  return a._id;
}
exports.OwnerMassUpload = Trackerror(async (req, res, next) => {
  if (!req.files || !req.files.file) {
    res.status(404).json({ message: "File not found" });
  } else if (req.files.file.mimetype === "application/json") {
    try {
      let de = JSON.parse(req.files.file.data.toString("utf8"));
      let tempnationality;
      let original = [];
      let data;
      // let ShortCodeValidation = [];
      // await de.map((data) => {
      //   ShortCodeValidation.push(data.shortCode);
      // });
      // const Duplicates = await OwnerModel.findAll({
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
      let nationalforeignkeys = Array.from(
        new Set(de.map((item) => item.NationalityID))
      );

      const index = nationalforeignkeys.indexOf(undefined);
      if (index > -1) {
        // only splice array when item is found
        nationalforeignkeys.splice(index, 1); // 2nd parameter means remove one item only
      }

      nationalforeignkeys.push(232);

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
      for (let i = 0; i < de.length; i++) {
        temp = exchangefunction(
          nationalforeignkeys,
          de[i].NationalityID || 232
        );
        if (i == 3151) {
          console.log(de[i]);
        }
        if (Date.parse(de[i].RegistrationDate) == NaN) {
          console.log(de[i]);
          return new HandlerCallBack("Date format is not ok", 404);
        }
        original.push({
          NameEn: de[i].NameEn,
          NameAr: de[i].NameAr,
          NationalityID: temp,
          TitleEn: de[i].TitleEn,
          TitleAr: de[i].TitleAr,
          shortCode: de[i].shortCode || null,
          ShortEn: de[i].ShortEn || de[i].TitleEn,
          ShortAr: de[i].ShortAr || de[i].TitleAr,
          RegistrationDate: de[i].RegistrationDate,
          BackupId: de[i].id,
        });
        // }
        // var sources = _.map(req.body.discoverySource, function (source) {
        //   return {
        //     discoverySource: source,
        //     organizationId: req.body.organizationId
        //   };
        // });
      }
      const db = await OwnerModel.bulkCreate(original);

      res.status(200).json({
        success: true,
        db,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err,
      });
    }
  } else {
    res.status(409).json({ message: "file format is not valid" });
  }
});
exports.CreateOwner = Trackerror(async (req, res, next) => {
  const {
    NameEn,
    NameAr,
    SilkColor,
    TitleAr,
    TitleEn,
    Horses,
    Rating,
    ShortEn,
    ShortAr,
    RegistrationDate,
    NationalityID,
  } = req.body;
  if (req.files === null) {
    try {
      const data = await OwnerModel.create({
        NameEn: NameEn,
        NameAr: NameAr,
        Rating: Rating,
        ShortEn: ShortEn,
        ShortAr: ShortAr,
        TitleAr: TitleAr,
        TitleEn: TitleEn,
        NationalityID: NationalityID,
        RegistrationDate: RegistrationDate,
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
    const file1 = req.files.Ownerimage;
    console.log(file1, "file1");
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(
      req.files.Ownerimage.data,
      214,
      212
    );
    await uploadFile(fileBuffer, `${Owner}/${Image}`, file1.mimetype);
    const data = await OwnerModel.create({
      image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Owner}/${Image}`,
      NameEn: NameEn,
      NameAr: NameAr,
      Rating: Rating,
      ShortEn: ShortEn,
      ShortAr: ShortAr,
      TitleAr: TitleAr,
      TitleEn: TitleEn,
      NationalityID: NationalityID,
      RegistrationDate: RegistrationDate,
    });
    res.status(201).json({
      success: true,
      data,
    });
  }
});
exports.AddOwnerSilkColor = Trackerror(async (req, res, next) => {
  const data = await OwnerModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return new HandlerCallBack("Owner is not available", 404);
  }
  let file = [req.files.image];
  await file.map(async (singleimage) => {
    console.log(singleimage, "dsadsa");
    let SingleImage = generateFileName();
    console.log(singleimage);
    let SingleimagefileBuffer = await resizeImageBuffer(
      singleimage.data,
      214,
      212
    );
    await uploadFile(
      SingleimagefileBuffer,
      `${OwnerSilk}/${SingleImage}`,
      singleimage.mimetype
    );
    await OwnerSilkColorModel.findOrCreate({
      where: {
        OwnerID: data._id,
        OwnerSilkColor: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${OwnerSilk}/${SingleImage}`,
      },
    });
  });
  res.status(201).json({
    success: true,
    data,
  });
});
exports.AddOwnerCap = Trackerror(async (req, res, next) => {
  const data = await OwnerModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return new HandlerCallBack("Owner is not available", 404);
  }
  let file = [req.files.image];
  await file.map(async (singleimage) => {
    console.log(singleimage, "dsadsa");
    let SingleImage = generateFileName();
    console.log(singleimage);
    let SingleimagefileBuffer = await resizeImageBuffer(
      singleimage.data,
      214,
      212
    );
    await uploadFile(
      SingleimagefileBuffer,
      `${OwnerCap}/${SingleImage}`,
      singleimage.mimetype
    );
    await OwnerCapModel.findOrCreate({
      where: {
        OwnerID: data._id,
        OwnerCapColor: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${OwnerCap}/${SingleImage}`,
      },
    });
  });
  res.status(201).json({
    success: true,
    data,
  });
});
exports.UpdateOwnerDetail = Trackerror(async (req, res, next) => {
  const {
    NameEn,
    NameAr,
    SilkColor,
    TitleAr,
    TitleEn,
    Horses,
    Rating,
    ShortEn,
    ShortAr,
    RegistrationDate,
    NationalityID,
  } = req.body;
  let data = await OwnerModel.findOne({
    where: { _id: req.params.id },
  });
  if (data === null) {
    return new HandlerCallBack("data not found", 404);
  }
  if (req.files == null) {
    const updateddata = {
      image: data.Ownerimage,
      NameEn: NameEn || data.NameEn,
      NameAr: NameAr || data.NameAr,
      ShortEn: ShortEn || data.ShortEn,
      TitleAr: TitleAr || data.TitleAr,
      TitleEn: TitleEn || data.TitleEn,
      ShortAr: ShortAr || data.ShortAr,
      RegistrationDate: RegistrationDate || data.RegistrationDate,
      NationalityID: NationalityID || data.NationalityID,
      SilkColor: SilkColor || data.SilkColor,
      Horses: Horses || data.Horses,
      Rating: Rating || data.Rating,
    };
    data = await OwnerModel.update(updateddata, {
      where: {
        _id: req.params.id,
      },
    });
    res.status(200).json({
      success: true,
      data,
    });
  } else {
    const file = req.files.Ownerimage;
    await deleteFile(`${Owner}/${data.Ownerimage}`);
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${Owner}/${Image}`, file.mimetype);
    const updateddata = {
      image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Owner}/${Image}`,
      NameEn: NameEn || data.NameEn,
      NameAr: NameAr || data.NameAr,
      ShortEn: ShortEn || data.ShortEn,
      ShortAr: ShortAr || data.ShortAr,
      RegistrationDate: RegistrationDate || data.RegistrationDate,
      NationalityID: NationalityID || data.NationalityID,
      SilkColor: SilkColor || data.SilkColor,
      Horses: Horses || data.Horses,
      Rating: Rating || data.Rating,
      TitleAr: TitleAr || data.TitleAr,
      TitleEn: TitleEn || data.TitleEn,
    };

    data = await OwnerModel.update(updateddata, {
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
exports.SearchOwner = Trackerror(async (req, res, next) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page - 1, size);
  await OwnerModel.findAndCountAll({
    order: [[req.query.orderby || "createdAt", req.query.sequence || "ASC"]],
    where: {
      NameEn: {
        [Op.like]: `%${req.query.NameEn || ""}%`,
      },
      NameAr: {
        [Op.like]: `%${req.query.NameAr || ""}%`,
      },
      TitleEn: {
        [Op.like]: `%${req.query.TitleEn || ""}%`,
      },
      TitleAr: {
        [Op.like]: `%${req.query.TitleAr || ""}%`,
      },
      ShortEn: {
        [Op.like]: `%${req.query.ShortEn || ""}%`,
      },
      ShortAr: {
        [Op.like]: `%${req.query.ShortAr || ""}%`,
      },
      RegistrationDate: {
        [Op.between]: [
          req.query.startRegistrationDate || "1000-01-01 00:00:00",
          req.query.endRegistrationDate || "4030-12-01 00:00:00",
        ],
      },
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
    include: [
      {
        model: db.NationalityModel,
        as: 'OwnerDataNationalityData',
        attributes: ["NameEn"]
      }
    ]

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
exports.UpdateOwnerHorse = Trackerror(async (req, res, next) => { });
exports.ViewAllOwner = Trackerror(async (req, res, next) => {
  const data = await OwnerModel.findAll({ include: { all: true } });
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.ViewASingleOwner = Trackerror(async (req, res, next) => {
  const data = await OwnerModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return new HandlerCallBack("Owner is not available", 404);
  } else {
    res.status(200).json({
      success: true,
      data,
    });
  }
});
exports.DeleteOwner = Trackerror(async (req, res, next) => {
  const data = await OwnerModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return new HandlerCallBack("data not found", 404);
  }

  console.log(data);
  await deleteFile(`${Owner}/${data.image.slice(-64)}`);
  await OwnerModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteOwner = Trackerror(async (req, res, next) => {
  const data = await OwnerModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  let checkcode = await OwnerModel.findOne({
    paranoid: false,
    where: { shortCode: -data.shortCode },
  });
  console.log(checkcode);
  if (checkcode) {
    console.log("hello");
    let [result] = await OwnerModel.findAll({
      paranoid: false,
      attributes: [
        [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
      ],
    });
    console.log(-result.dataValues.maxshortCode, "dsd");
    await OwnerModel.update(
      { shortCode: -result.dataValues.maxshortCode },
      {
        where: {
          _id: req.params.id,
        },
      }
    );
    await OwnerModel.destroy({
      where: { _id: req.params.id },
    });

    res.status(200).json({
      success: true,
      message: "Soft Delete Successfully",
    });
  } else {
    console.log(data.shortCode);
    await OwnerModel.update(
      { shortCode: -data.shortCode },
      {
        where: {
          _id: req.params.id,
        },
      }
    );

    await OwnerModel.destroy({
      where: { _id: req.params.id },
    });
    res.status(200).json({
      success: true,
      message: "Soft Delete Successfully",
    });
  }
});