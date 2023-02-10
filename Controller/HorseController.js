const db = require("../config/Connection");
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const TrainerModel = db.TrainerModel;
const HorseAndRaceModel = db.HorseAndRaceModel;
const HorseModel = db.HorseModel;
const OwnerModel = db.OwnerModel;
const JockeyModel = db.JockeyModel;
const NationalityModel = db.NationalityModel;
const HorseKindModel = db.HorseKindModel;
const BreederModel = db.BreederModel;
const ColorModel = db.ColorModel;
const SexModel = db.SexModel;
const { getPagination, getPagingData } = require("../Utils/Pagination");
const Features = require("../Utils/Features");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const HorseJockeyComboModel = db.HorseJockeyComboModel;
const HorseOwnerComboModel = db.HorseOwnerComboModel;
const HorseTrainerComboModel = db.HorseTrainerComboModel;
const { uploadFile, deleteFile } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const { Horse } = require("../Utils/Path");
const { Conversion } = require("../Utils/Conversion");
const { Op, Sequelize } = require("sequelize");
const RaceModel = db.RaceModel;
exports.RaceHorse = Trackerror(async (req, res, next) => {
  const racedata = await RaceModel.findOne({
    where: {
      _id: req.params.raceid,
    },
  });
  const data = await HorseModel.findAll({
    include: [
      {
        model: db.OwnerModel,
        as: "ActiveOwnerData",
      },
    ],
    attributes: ["NameEn", "NameAr", "_id", "ActiveOwner", "STARS"],
    where: {
      KindHorse: {
        [Op.eq]: racedata.HorseKindinRace,
      },
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
exports.HorsesInRace = Trackerror(async (req, res, next) => {
  // HorseModelIdData1
  const data = await HorseAndRaceModel.findAll({
    include: [
      {
        model: db.HorseModel,
        as: "HorseModelIdData1",
        attributes: ["_id", "HorseImage", "KindHorse", "NameEn", "NameAr", "STARS"],
      },
      // {
      //   model: db.JockeyModel,
      //   as: "HorseModelIdData1",
      //   attributes: ["_id", "HorseImage", "KindHorse", "NameEn", "NameAr"],
      // },
      // {
      //   model: db.TrainerModel,
      //   as: "HorseModelIdData1",
      //   attributes: ["_id", "HorseImage", "KindHorse", "NameEn", "NameAr"],
      // },
      // {
      //   model: db.EquipmentModel,
      //   as: "HorseModelIdData1",
      //   attributes: ["_id", "HorseImage", "KindHorse", "NameEn", "NameAr"],
      // },
    ],
    attributes: ["_id", "TrainerOnRace", "JockeyOnRace"],
    where: {
      RaceModelId: {
        [Op.eq]: req.params.raceid,
      },
    },
  });
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.GetDeletedHorse = Trackerror(async (req, res, next) => {
  const data = await HorseModel.findAll({
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
exports.RestoreSoftDeletedHorse = Trackerror(async (req, res, next) => {
  const data = await HorseModel.findOne({
    paranoid: false,
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  let checkcode = await HorseModel.findOne({
    paranoid: false,
    where: { shortCode: -1 * data.shortCode },
  });
  console.log(checkcode);
  if (checkcode) {
    let [result] = await HorseModel.findAll({
      paranoid: false,
      attributes: [
        [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
      ],
    });
    console.log(-1 * (result.dataValues.maxshortCode + 1));
    let newcode = result.dataValues.maxshortCode + 1;
    console.log(newcode, "dsd");
    await HorseModel.update(
      { shortCode: newcode },
      {
        where: {
          _id: req.params.id,
        },
        paranoid: false,
      }
    );
    const restoredata = await HorseModel.restore({
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
      await HorseModel.update(
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

    const restoredata = await HorseModel.restore({
      where: { _id: req.params.id },
    });
    res.status(200).json({
      success: true,
      restoredata,
    });
  }
});

exports.SearchName = Trackerror(async (req, res, next) => {
  const { Query } = req.body;
  console.log(Query);
  const data1 = await HorseModel.findAll({
    where: {
      NameEn: {
        [Op.like]: `%${Query}%`,
      },
    },
    include: { all: true },
  });
  const data2 = await TrainerModel.findAll({
    where: {
      NameEn: {
        [Op.like]: `%${Query}%`,
      },
    },
    include: { all: true },
  });
  const data3 = await OwnerModel.findAll({
    where: {
      NameEn: {
        [Op.like]: `%${Query}%`,
      },
    },
    include: { all: true },
  });
  const data4 = await JockeyModel.findAll({
    where: {
      NameEn: {
        [Op.like]: `%${Query}%`,
      },
    },
    include: { all: true },
  });
  res.status(200).json({
    success: true,
    data1,
    data2,
    data3,
    data4,
  });
});
exports.HorseDropDown = Trackerror(async (req, res, next) => {
  const data = await HorseModel.findAll({
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
function exchangefunction(arraytobechecked, valuetobechecked, val) {
  let a = arraytobechecked.find((item) => item.BackupId == valuetobechecked);
  console.log(a, valuetobechecked, val);
  return a._id;
}
exports.HorseMassUpload = Trackerror(async (req, res, next) => {
  if (!req.files || !req.files.file) {
    res.status(404).json({ message: "File not found" });
  } else if (req.files.file.mimetype === "application/json") {
    let de = JSON.parse(req.files.file.data.toString("utf8"));
    let ShortCodeValidation = [];
    await de.map((data) => {
      ShortCodeValidation.push(data.shortCode);
    });
    const Duplicates = await HorseModel.findAll({
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
      let tempnationality;
      let temphorsekind;
      let temptrainer;
      let tempsex;
      let tempowner;
      let tempbreeder;
      let tempcolor;
      let original = [];
      let data;

      let nationalforeignkeys = Array.from(
        new Set(de.map((item) => item.NationalityID))
      );

      let horsekindforeignkeys = Array.from(
        new Set(de.map((item) => item.KindHorse))
      );

      let trainerforeignkeys = Array.from(
        new Set(de.map((item) => item.ActiveTrainer))
      );
      let breederforeignkeys = Array.from(
        new Set(de.map((item) => item.Breeder))
      );
      let sexforeignkeys = Array.from(new Set(de.map((item) => item.Sex)));
      let ownerforeignkeys = Array.from(
        new Set(de.map((item) => item.ActiveOwner))
      );
      let colorforeignkeys = Array.from(
        new Set(de.map((item) => item.ColorID))
      );

      const index = nationalforeignkeys.indexOf(undefined);
      if (index > -1) {
        nationalforeignkeys.splice(index, 1);
      }

      tempnationality = await NationalityModel.findAll({
        where: { BackupId: nationalforeignkeys },
        attributes: ["_id", "BackupId"],
      });
      temphorsekind = await HorseKindModel.findAll({
        where: { BackupId: horsekindforeignkeys },
        attributes: ["_id", "BackupId"],
      });
      temptrainer = await TrainerModel.findAll({
        where: { BackupId: trainerforeignkeys },
        attributes: ["_id", "BackupId"],
      });
      tempowner = await OwnerModel.findAll({
        where: { BackupId: ownerforeignkeys },
        attributes: ["_id", "BackupId"],
      });
      tempsex = await SexModel.findAll({
        where: { BackupId: sexforeignkeys },
        attributes: ["_id", "BackupId"],
      });
      tempbreeder = await BreederModel.findAll({
        where: { BackupId: breederforeignkeys },
        attributes: ["_id", "BackupId"],
      });
      tempcolor = await ColorModel.findAll({
        where: { BackupId: colorforeignkeys },
        attributes: ["_id", "BackupId"],
      });
      // tempcreation = await NationalityModel.findAll({
      //   where: { BackupId: creationforeignkeys },
      //   attributes: ["_id", "BackupId"]
      // });

      nationalforeignkeys = [];
      // creationforeignkeys = [];
      horsekindforeignkeys = [];
      breederforeignkeys = [];
      sexforeignkeys = [];
      trainerforeignkeys = [];
      ownerforeignkeys = [];
      colorforeignkeys = [];

      tempnationality.map((newdata) => {
        console.log(newdata, "nationality");
        nationalforeignkeys.push({
          _id: newdata._id,
          BackupId: newdata.BackupId,
        });
      });

      // tempcreation.map((newdata) => {
      //   creationforeignkeys.push({
      //     _id: newdata._id,
      //     BackupId: newdata.BackupId
      //   });
      // });
      temphorsekind.map((newdata) => {
        console.log(newdata, "horsekind");
        horsekindforeignkeys.push({
          _id: newdata._id,
          BackupId: newdata.BackupId,
        });
      });

      tempbreeder.map((newdata) => {
        breederforeignkeys.push({
          _id: newdata._id,
          BackupId: newdata.BackupId,
        });
      });

      tempowner.map((newdata) => {
        ownerforeignkeys.push({
          _id: newdata._id,
          BackupId: newdata.BackupId,
        });
      });

      tempcolor.map((newdata) => {
        colorforeignkeys.push({
          _id: newdata._id,
          BackupId: newdata.BackupId,
        });
      });

      tempsex.map((newdata) => {
        sexforeignkeys.push({
          _id: newdata._id,
          BackupId: newdata.BackupId,
        });
      });

      temptrainer.map((newdata) => {
        trainerforeignkeys.push({
          _id: newdata._id,
          BackupId: newdata.BackupId,
        });
      });

      let nationtemp;
      let colortemp;
      let breedertemp;
      let horsekindtemp;
      let sextemp;
      let trainertemp;
      let ownertemp;
      // let creationtemp;
      for (let i = 0; i < de.length; i++) {
        nationtemp = exchangefunction(
          nationalforeignkeys,
          de[i].NationalityID || 232,
          "nat"
        );
        colortemp = exchangefunction(colorforeignkeys, de[i].ColorID, "col");
        breedertemp = exchangefunction(
          breederforeignkeys,
          de[i].Breeder,
          "bred"
        );
        horsekindtemp = exchangefunction(
          horsekindforeignkeys,
          de[i].KindHorse,
          "horsekind"
        );
        sextemp = exchangefunction(sexforeignkeys, de[i].Sex, "sex");
        trainertemp = exchangefunction(
          trainerforeignkeys,
          de[i].ActiveTrainer,
          "trainer"
        );
        ownertemp = exchangefunction(
          ownerforeignkeys,
          de[i].ActiveOwner,
          "owner"
        );
        // creationtemp = exchangefunction(creationforeignkeys, de[i].CreationId);
        // console.log(nationtemp);

        original.push({
          NameEn: de[i].NameEn,
          NameAr: de[i].NameAr,
          SireNameEn: de[i].SireNameEn || "N/A",
          SireNameAr: de[i].SireNameAr || "N/A",
          GSireNameEn: de[i].GSireNameEn || "N/A",
          GSireNameAr: de[i].GSireNameAr || "N/A",
          DamNameEn: de[i].DamNameEn || "N/A",
          DamNameAr: de[i].DamNameAr || "N/A",
          DOB: "2011-02-02",
          ActiveTrainer: trainertemp,
          Breeder: breedertemp,
          RemarksEn: de[i].RemarksEn || "N/A",
          Sex: sextemp,
          Color: colortemp,
          Earning: de[i].Earning || 0,
          STARS: de[i].STARS,
          ActiveOwner: ownertemp,
          NationalityID: nationtemp,
          Foal: de[i].Foal || 1,
          PurchasePrice: 1,
          Cap: de[i].Cap,
          Rds: de[i].Rds,
          ColorID: colortemp,
          CreationId: nationtemp,
          HorseStatus: de[i].HorseStatus,
          Dam: de[i].Dam || null,
          Sire: de[i].Sire || null,
          GSire: de[i].GSire || null,
          Height: de[i].Height || 0,
          KindHorse: horsekindtemp,
          shortCode: de[i].shortCode || null,
          RemarksAr: de[i].RemarksAr || "N/A",
          BackupId: de[i].id,
        });
      }
      console.log(original);
      // var sources = _.map(req.body.discoverySource, function (source) {
      //   return {
      //     discoverySource: source,
      //     organizationId: req.body.organizationId
      //   };
      // });
      try {
        const db = await HorseModel.bulkCreate(original);

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
    }
  } else {
    res.status(409).json({ message: "file format is not valid" });
  }
});
exports.PedigreeHorse = Trackerror(async (req, res, next) => {
  let generation1 = await HorseModel.findOne({
    where: { _id: req.params.id },
    paranoid: false,
    attributes: ["Dam", "Sire", "shortCode", "_id", "DOB", "NameEn", "NameAr"],
    include: [
      {
        paranoid: false,
        model: db.HorseModel,
        as: "DamData",
        attributes: ["NameEn", "NameAr"],
      },
      {
        paranoid: false,
        model: db.HorseModel,
        as: "SireData",
        attributes: ["NameEn", "NameAr"],
      },
    ],
  });
  let generation2a = null;
  let generation2b = null;
  let generation3a = null;
  let generation3b = null;
  let generation3c = null;
  let generation3d = null;
  if (generation1) {
    generation2a = await HorseModel.findOne({
      where: { _id: generation1.Dam },
      paranoid: false,
      attributes: [
        "Dam",
        "Sire",
        "shortCode",
        "_id",
        "DOB",
        "NameEn",
        "NameAr",
      ],
      include: [
        {
          paranoid: false,
          model: db.HorseModel,
          as: "DamData",
          attributes: ["NameEn", "NameAr"],
        },
        {
          paranoid: false,
          model: db.HorseModel,
          as: "SireData",
          attributes: ["NameEn", "NameAr"],
        },
      ],
    });
  }
  if (generation1) {
    generation2b = await HorseModel.findOne({
      where: { _id: generation1.Sire },
      paranoid: false,
      attributes: [
        "Dam",
        "Sire",
        "shortCode",
        "_id",
        "DOB",
        "NameEn",
        "NameAr",
      ],
      include: [
        {
          paranoid: false,
          model: db.HorseModel,
          as: "DamData",
          attributes: ["NameEn", "NameAr"],
        },
        {
          paranoid: false,
          model: db.HorseModel,
          as: "SireData",
          attributes: ["NameEn", "NameAr"],
        },
      ],
    });
  }
  console.log(generation2a);

  if (generation2a) {
    generation3a = await HorseModel.findOne({
      where: { _id: generation2a.Dam },
      paranoid: false,
      attributes: [
        "Dam",
        "Sire",
        "shortCode",
        "_id",
        "DOB",
        "NameEn",
        "NameAr",
      ],
      include: [
        {
          paranoid: false,
          model: db.HorseModel,
          as: "DamData",
          attributes: ["NameEn", "NameAr"],
        },
        {
          paranoid: false,
          model: db.HorseModel,
          as: "SireData",
          attributes: ["NameEn", "NameAr"],
        },
      ],
    });
  }

  if (generation2a) {
    generation3b = await HorseModel.findOne({
      where: { _id: generation2a.Sire },
      paranoid: false,
      attributes: [
        "Dam",
        "Sire",
        "shortCode",
        "_id",
        "DOB",
        "NameEn",
        "NameAr",
      ],
      include: [
        {
          paranoid: false,
          model: db.HorseModel,
          as: "DamData",
          attributes: ["NameEn", "NameAr"],
        },
        {
          paranoid: false,
          model: db.HorseModel,
          as: "SireData",
          attributes: ["NameEn", "NameAr"],
        },
      ],
    });
  }
  if (generation2b) {
    generation3c = await HorseModel.findOne({
      where: { _id: generation2b.Dam },
      paranoid: false,
      attributes: [
        "Dam",
        "Sire",
        "shortCode",
        "_id",
        "DOB",
        "NameEn",
        "NameAr",
      ],
      include: [
        {
          paranoid: false,
          model: db.HorseModel,
          as: "DamData",
          attributes: ["NameEn", "NameAr"],
        },
        {
          paranoid: false,
          model: db.HorseModel,
          as: "SireData",
          attributes: ["NameEn", "NameAr"],
        },
      ],
    });
  }
  if (generation2b) {
    generation3d = await HorseModel.findOne({
      where: { _id: generation2b.Sire },
      paranoid: false,
      attributes: [
        "Dam",
        "Sire",
        "shortCode",
        "_id",
        "DOB",
        "NameEn",
        "NameAr",
      ],
      include: [
        {
          paranoid: false,
          model: db.HorseModel,
          as: "DamData",
          attributes: ["NameEn", "NameAr"],
        },
        {
          paranoid: false,
          model: db.HorseModel,
          as: "SireData",
          attributes: ["NameEn", "NameAr"],
        },
      ],
    });
  }

  res.status(200).json({
    success: true,
    generation1,
    generation2a,
    generation2b,
    generation3a,
    generation3b,
    generation3c,
    generation3d,
  });
});
exports.SearchHorse = Trackerror(async (req, res, next) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page - 1, size);
  await HorseModel.findAndCountAll({
    order: [[req.query.orderby || "createdAt", req.query.sequence || "DESC"]],
    include: { all: true },
    where: {
      KindHorse: {
        [Op.like]: `%${req.query.KindHorse || ""}%`,
      },
      Breeder: {
        [Op.like]: `%${req.query.Breeder || ""}%`,
      },
      Sex: {
        [Op.like]: `%${req.query.Sex || ""}%`,
      },
      ActiveOwner: {
        [Op.like]: `%${req.query.ActiveOwner || ""}%`,
      },
      ActiveTrainer: {
        [Op.like]: `%${req.query.ActiveTrainer || ""}%`,
      },
      NationalityID: {
        [Op.like]: `%${req.query.NationalityID || ""}%`,
      },
      CreationId: {
        [Op.like]: `%${req.query.CreationId || ""}%`,
      },
      Foal: {
        [Op.like]: `%${req.query.Foal || ""}%`,
      },
      RemarksEn: {
        [Op.like]: `%${req.query.RemarksEn || ""}%`,
      },
      RemarksAr: {
        [Op.like]: `%${req.query.RemarksAr || ""}%`,
      },
      NameEn: {
        [Op.like]: `%${req.query.NameEn || ""}%`,
      },
      NameAr: {
        [Op.like]: `%${req.query.NameAr || ""}%`,
      },

      createdAt: {
        [Op.between]: [
          req.query.startdate || "2021-12-01 00:00:00",
          req.query.endDate || "4030-12-01 00:00:00",
        ],
      },

      ColorID: {
        [Op.like]: `%${req.query.ColorID || ""}%`,
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
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
});
exports.GetHorse = Trackerror(async (req, res, next) => {
  let data = await HorseModel.findAll({
    include: { all: true },
  });
  res.status(200).json({
    success: true,
    data,
  });
});

exports.SingleHorse = Trackerror(async (req, res, next) => {
  const data = await HorseModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return new next("Horse is not available", 404);
  } else {
    res.status(200).json({
      success: true,
      data,
    });
  }
});
exports.CreateHorse = Trackerror(async (req, res, next) => {
  const {
    STARS,
    CreationId,
    NameEn,
    DOB,
    NameAr,
    Owner,
    ActiveTrainer,
    Breeder,
    Trainer,
    Sex,
    Color,
    Earning,
    History,
    ActiveOwner,
    NationalityID,
    Foal,
    PurchasePrice,
    Cap,
    Rds,
    ColorID,
    HorseStatus,
    Dam,
    Sire,
    GSire,
    Height,
    KindHorse,
    shortCode,
    RemarksAr,
    RemarksEn,
  } = req.body;
  const file = req.files.image;
  if (file == null) {
    return next(new HandlerCallBack("Please upload an image", 404));
  }
  const Image = generateFileName();
  const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
  await uploadFile(fileBuffer, `${Horse}/${Image}`, file.mimetype);
  const data = await HorseModel.create({
    HorseImage: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Horse}/${Image}`,
    NameEn: NameEn,
    DOB: DOB,
    NameAr: NameAr,
    ActiveTrainer: ActiveTrainer,
    Breeder: Breeder,
    RemarksEn: RemarksEn,
    Sex: Sex,
    Color: Color,
    Earning: Earning,
    History: History,
    STARS: STARS,
    ActiveOwner: ActiveOwner,
    NationalityID: NationalityID,
    Foal: Foal,
    PurchasePrice: PurchasePrice,
    Cap: Cap,
    Rds: Rds,
    ColorID: ColorID,
    CreationId: CreationId,
    HorseStatus: HorseStatus,
    Dam: Dam || null,
    Sire: Sire || null,
    GSire: GSire || null,
    Height: Height,
    KindHorse: KindHorse,
    shortCode: shortCode,
    RemarksAr: RemarksAr,
  });

  if (data._id) {
    if (Owner) {
      let OwnerData = Conversion(Owner);
      // OwnerData.push(ActiveOwner);
      await OwnerData.map(async (singleOwner) => {
        await HorseOwnerComboModel.create({
          HorseModelId: data._id,
          OwnerModelId: singleOwner,
        });
      });
    }

    if (Trainer) {
      let TrainerData = Conversion(Trainer);
      // TrainerData.push(ActiveTrainer);
      await TrainerData.map(async (singleTrainer) => {
        await HorseTrainerComboModel.create({
          HorseModelId: data._id,
          TrainerModelId: singleTrainer,
        });
      });
    }

    // if (Jockey) {
    //   let JockeyData = Conversion(Jockey);
    //   console.log(JockeyData);
    //   await JockeyData.map(async (singleJockey) => {
    //     await HorseJockeyComboModel.create({
    //       HorseModelId: data._id,
    //       JockeyModelId: singleJockey,
    //     });
    //   });
    // }
    res.status(200).json({
      success: true,
      data,
    });
  } else {
    return next(new HandlerCallBack("Error Occured", 404));
  }
});
exports.UpdateHorse = Trackerror(async (req, res, next) => {
  const {
    NameEn,
    DOB,
    NameAr,
    Breeder,
    RemarksEn,
    HorseRating,
    Sex,
    Color,
    RemarksAr,
    KindOfHorse,
    Dam,
    Sire,
    GSire,
    Earning,
    Foal,
    PurchasePrice,
    Cap,
    Rds,
    ColorID,
    NationalityID,
    CreationId,
    Height,
    KindHorse,
    ActiveTrainer,
    STARS,
    shortCode,
  } = req.body;
  let data = await HorseModel.findOne({
    where: { _id: req.params.id },
  });

  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  if (req.files == null) {
    const updateddata = {
      HorseImage: data.HorseImage,
      NameEn: NameEn || data.NameEn,
      DOB: DOB || data.DOB,
      NameAr: NameAr || data.NameAr,
      Breeder: Breeder || data.Breeder,
      RemarksEn: RemarksEn || data.RemarksEn,
      RemarksAr: RemarksAr || data.RemarksAr,
      HorseRating: HorseRating || data.HorseRating,
      Sex: Sex || data.Sex,
      Color: Color || data.Color,
      KindOfHorse: KindOfHorse || data.KindOfHorse,
      Dam: Dam || data.Dam,
      Sire: Sire || data.Sire,
      GSire: GSire || data.GSire,
      Earning: Earning || data.Earning,
      Foal: Foal || data.Foal,
      PurchasePrice: PurchasePrice || data.PurchasePrice,
      Cap: Cap || data.Cap,
      Rds: Rds || data.Rds,
      ColorID: ColorID || data.ColorID,
      CreationId: CreationId || data.CreationId,
      Height: Height || data.Height,
      NationalityID: NationalityID || data.NationalityID,
      KindHorse: KindHorse || data.KindHorse,
      ActiveTrainer: ActiveTrainer || data.ActiveTrainer,
      STARS: STARS || data.STARS,
      shortCode: shortCode || data.shortCode,
    };
    data = await HorseModel.update(updateddata, {
      where: {
        _id: req.params.id,
      },
    });
    res.status(200).json({
      success: true,
      data,
    });
  } else {
    const file = req.files.Horseimage;
    await deleteFile(`${Horse}/${data.Horseimage}`);
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(
      req.files.Horseimage.data,
      214,
      212
    );
    await uploadFile(fileBuffer, `${Horse}/${Image}`, file.mimetype);
    const updateddata = {
      HorseImage: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Horse}/${Image}`,
      NameEn: NameEn || data.NameEn,
      NameEn: NameEn || data.NameEn,
      NameEn: NameEn || data.NameEn,
      DOB: DOB || data.DOB,
      NameAr: NameAr || data.NameAr,
      Breeder: Breeder || data.Breeder,
      RemarksEn: RemarksEn || data.RemarksEn,
      HorseRating: HorseRating || data.HorseRating,
      Sex: Sex || data.Sex,
      Color: Color || data.Color,
      KindOfHorse: KindOfHorse || data.KindOfHorse,
      Dam: Dam || data.Dam,
      Sire: Sire || data.Sire,
      GSire: GSire || data.GSire,
      Earning: Earning || data.Earning,
      Foal: Foal || data.Foal,
      PurchasePrice: PurchasePrice || data.PurchasePrice,
      Cap: Cap || data.Cap,
      Rds: Rds || data.Rds,
      ColorID: ColorID || data.ColorID,
      NationalityID: NationalityID || data.NationalityID,
      CreationId: CreationId || data.CreationId,
      Height: Height || data.Height,
      KindHorse: KindHorse || data.KindHorse,
      ActiveTrainer: ActiveTrainer || data.ActiveTrainer,
      shortCode: shortCode || data.shortCode,
      RemarksAr: RemarksAr || data.RemarksAr,
    };
    data = await HorseModel.update(updateddata, {
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
exports.DeleteHorse = Trackerror(async (req, res, next) => {
  const data = await HorseModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);
  await deleteFile(`${Horse}/${data.HorseImage.slice(-64)}`);
  await HorseModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteHorse = Trackerror(async (req, res, next) => {
  const data = await HorseModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  let checkcode = await HorseModel.findOne({
    paranoid: false,
    where: { shortCode: -data.shortCode },
  });
  console.log(checkcode);
  if (checkcode) {
    console.log("hello");
    let [result] = await HorseModel.findAll({
      paranoid: false,
      attributes: [
        [sequelize.fn("max", sequelize.col("shortCode")), "maxshortCode"],
      ],
    });
    console.log(-result.dataValues.maxshortCode, "dsd");
    await HorseModel.update(
      { shortCode: -result.dataValues.maxshortCode },
      {
        where: {
          _id: req.params.id,
        },
      }
    );
    await HorseModel.destroy({
      where: { _id: req.params.id },
    });

    res.status(200).json({
      success: true,
      message: "Soft Delete Successfully",
    });
  } else {
    console.log(data.shortCode);
    await HorseModel.update(
      { shortCode: -data.shortCode },
      {
        where: {
          _id: req.params.id,
        },
      }
    );

    await HorseModel.destroy({
      where: { _id: req.params.id },
    });
    res.status(200).json({
      success: true,
      message: "Soft Delete Successfully",
    });
  }
});
