const db = require("../config/Connection");
const JockeyModel = db.JockeyModel;
const NationalityModel = db.NationalityModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { Jockey, Breeder } = require("../Utils/Path");
const { uploadFile, deleteFile } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const Features = require("../Utils/Features");
const { Op } = require("sequelize");
function exchangefunction(arraytobechecked, valuetobechecked, val) {
  let a = arraytobechecked.find((item) => item.BackupId == valuetobechecked);
  return a._id;
}
exports.GetDeletedJockey = Trackerror(async (req, res, next) => {
  const data = await JockeyModel.findAll({
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
exports.RestoreSoftDeletedJockey = Trackerror(async (req, res, next) => {
  const data = await JockeyModel.findOne({
    paranoid: false,
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  let checkcode = await JockeyModel.findOne({
    paranoid: false,
    where: { shortCode: -1 * data.shortCode },
  });
  console.log(checkcode);
  if (checkcode) {
    let [result] = await JockeyModel.findAll({
      paranoid: false,
      attributes: [
        [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
      ],
    });
    console.log(-1 * (result.dataValues.maxshortCode + 1));
    let newcode = result.dataValues.maxshortCode + 1;
    console.log(newcode, "dsd");
    await JockeyModel.update(
      { shortCode: newcode },
      {
        where: {
          _id: req.params.id,
        },
        paranoid: false,
      }
    );
    const restoredata = await JockeyModel.restore({
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
      await JockeyModel.update(
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

    const restoredata = await JockeyModel.restore({
      where: { _id: req.params.id },
    });
    res.status(200).json({
      success: true,
      restoredata,
    });
  }
});
exports.JockeyMassUpload = Trackerror(async (req, res, next) => {
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
    const Duplicates = await JockeyModel.findAll({
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
          RemarksEn: de[i].RemarksEn || "N/A",
          RemarksAr: de[i].RemarksAr || "N/A",
          JockeyLicenseDate: de[i].JockeyLicenseDate || Date.now,
          DOB: de[i].DOB || de[i].JockeyLicenseDate,
          shortCode: de[i].shortCode || null,
          MiniumumJockeyWeight: de[i].MiniumumJockeyWeight,
          MaximumJockeyWeight: de[i].MaximumJockeyWeight || 0,
          JockeyAllowance: de[i].JockeyAllowance,
          Rating: de[i].Rating || 0,
          NationalityID: temp,
          RemarksAr: de[i].RemarksAr || "N/A",
          BackupId: de[i].id,
        });
      }

      console.log(original);
      const db = await JockeyModel.bulkCreate(original);
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

exports.CreateJockey = Trackerror(async (req, res, next) => {
  const {
    NameEn,
    NameAr,
    RemarksEn,
    RemarksAr,
    Rating,
    ShortNameEn,
    ShortNameAr,
    NationalityID,
    MiniumumJockeyWeight,
    MaximumJockeyWeight,
    JockeyAllowance,
    DOB,
    JockeyLicenseDate,
  } = req.body;
  if (req.files == null) {
    try {
      const data = await JockeyModel.create({
        NameEn: NameEn,
        NameAr: NameAr,
        ShortNameEn: ShortNameEn,
        ShortNameAr: ShortNameAr,
        MiniumumJockeyWeight: MiniumumJockeyWeight,
        MaximumJockeyWeight: MaximumJockeyWeight,
        JockeyAllowance: JockeyAllowance,
        DOB: DOB,
        NationalityID: NationalityID,
        RemarksEn: RemarksEn,
        RemarksAr: RemarksAr,
        JockeyLicenseDate: JockeyLicenseDate,
        Rating: Rating,
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
  }
  const file = req.files.image;
  const Image = generateFileName();
  const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
  await uploadFile(fileBuffer, `${Jockey}/${Image}`, file.mimetype);
  const data = await JockeyModel.create({
    image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Jockey}/${Image}`,
    NameEn: NameEn,
    NameAr: NameAr,
    ShortNameEn: ShortNameEn,
    ShortNameAr: ShortNameAr,
    MiniumumJockeyWeight: MiniumumJockeyWeight,
    MaximumJockeyWeight: MaximumJockeyWeight,
    JockeyAllowance: JockeyAllowance,
    DOB: DOB,
    NationalityID: NationalityID,
    RemarksEn: RemarksEn,
    RemarksAr: RemarksAr,
    JockeyLicenseDate: JockeyLicenseDate,
    Rating: Rating,
  });
  res.status(201).json({
    success: true,
    data,
  });
});
exports.SingleJockey = Trackerror(async (req, res, next) => {
  const data = await JockeyModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("Jockey is not available", 404));
  } else {
    res.status(200).json({
      success: true,
      data,
    });
  }
});
exports.SearchJockey = Trackerror(async (req, res, next) => {
  const totalcount = await JockeyModel.count();
  const data = await JockeyModel.findAll({
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
      // Rating: {
      //   [Op.eq]: `%${req.query.Rating || ""}%`,
      // },
      NationalityID: {
        [Op.like]: `%${req.query.NationalityID || ""}%`,
      },
      // RemarksEn: {
      //   [Op.like]: `%${req.query.RemarksEn || ""}%`,
      // },
      // RemarksAr: {
      //   [Op.like]: `%${req.query.RemarksAr || ""}%`,
      // },
      // MiniumumJockeyWeight: {
      //   [Op.like]: `%${req.query.MiniumumJockeyWeight || ""}%`,
      // },
      // MaximumJockeyWeight: {
      //   [Op.like]: `%${req.query.MaximumJockeyWeight || ""}%`,
      // },
      // JockeyAllowance: {
      //   [Op.like]: `%${req.query.JockeyAllowance || ""}%`,
      // },
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
exports.GetJockey = Trackerror(async (req, res, next) => {
  const data = await JockeyModel.findAll({
    include: { all: true },
  });
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.GetJockeyforRace = Trackerror(async (req, res, next) => {
  const { Jockeyids, JockeyName } = req.body;
  const data = await JockeyModel.findAll({
    where: {
      [Op.and]: [
        {
          _id: {
            [Op.ne]: Jockeyids,
          },
        },
        {
          NameEn: {
            [Op.like]: `%${JockeyName}%`,
          },
          NameAr: {
            [Op.like]: `%${JockeyName}%`,
          },
        },
      ],
    },
  });
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.JockeyDropDown = Trackerror(async (req, res, next) => {
  const data = await JockeyModel.findAll({
    attributes: [
      "NameEn",
      "NameAr",
      "_id",
      "MiniumumJockeyWeight",
      "MaximumJockeyWeight",
      "JockeyAllowance",
      "Rating",
    ],
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.EditJockey = Trackerror(async (req, res, next) => {
  const {
    NameEn,
    NameAr,
    ShortNameEn,
    ShortNameAr,
    NationalityID,
    MiniumumJockeyWeight,
    JockeyAllowance,
    MaximumJockeyWeight,
    Rating,
    DOB,
    JockeyLicenseDate,
  } = req.body;
  console.log(req.body);
  // if ((NationalityID = "")) {
  //   NationalityID = null;
  // }
  // if ((Rating = "")) {
  //   Rating = null;
  // }
  let data = await JockeyModel.findOne({
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
      MiniumumJockeyWeight: MiniumumJockeyWeight || data.MiniumumJockeyWeight,
      MaximumJockeyWeight: MaximumJockeyWeight || data.MaximumJockeyWeight,
      DOB: DOB || data.DOB,
      JockeyAllowance: JockeyAllowance || data.JockeyAllowance,
      NationalityID: NationalityID || data.NationalityID,
      Rating: Rating || data.Rating,
      JockeyLicenseDate: JockeyLicenseDate || data.JockeyLicenseDate,
    };
    data = await JockeyModel.update(updateddata, {
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
    await deleteFile(`${Jockey}/${data.image}`);
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${Jockey}/${Image}`, file.mimetype);

    const updateddata = {
      image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Jockey}/${Image}`,
      NameEn: NameEn || data.NameEn,
      NameAr: NameAr || data.NameAr,
      ShortNameEn: ShortNameEn || data.ShortNameEn,
      ShortNameAr: ShortNameAr || data.ShortNameAr,
      MiniumumJockeyWeight: MiniumumJockeyWeight || data.MiniumumJockeyWeight,
      MaximumJockeyWeight: MaximumJockeyWeight || data.MaximumJockeyWeight,
      DOB: DOB || data.DOB,
      JockeyAllowance: JockeyAllowance || data.JockeyAllowance,
      NationalityID: NationalityID || data.NationalityID,
      Rating: Rating || data.Rating,
    };

    data = await JockeyModel.update(updateddata, {
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
exports.DeleteJockey = Trackerror(async (req, res, next) => {
  const data = await JockeyModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);

  await JockeyModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteJockey = Trackerror(async (req, res, next) => {
  const data = await JockeyModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  let checkcode = await JockeyModel.findOne({
    paranoid: false,
    where: { shortCode: -data.shortCode },
  });
  console.log(checkcode);
  if (checkcode) {
    console.log("hello");
    let [result] = await JockeyModel.findAll({
      paranoid: false,
      attributes: [
        [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
      ],
    });
    console.log(-result.dataValues.maxshortCode, "dsd");
    await JockeyModel.update(
      { shortCode: -result.dataValues.maxshortCode },
      {
        where: {
          _id: req.params.id,
        },
      }
    );
    await JockeyModel.destroy({
      where: { _id: req.params.id },
    });

    res.status(200).json({
      success: true,
      message: "Soft Delete Successfully",
    });
  } else {
    console.log(data.shortCode);
    await JockeyModel.update(
      { shortCode: -data.shortCode },
      {
        where: {
          _id: req.params.id,
        },
      }
    );

    await JockeyModel.destroy({
      where: { _id: req.params.id },
    });
    res.status(200).json({
      success: true,
      message: "Soft Delete Successfully",
    });
  }
});
