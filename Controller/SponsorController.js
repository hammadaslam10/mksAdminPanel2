const db = require("../config/Connection");
const SponsorModel = db.SponsorModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { Sponsor } = require("../Utils/Path");
const { uploadFile, deleteFile } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const Features = require("../Utils/Features");
const { Op } = require("sequelize");
exports.GetDeletedSponsor = Trackerror(async (req, res, next) => {
  const data = await SponsorModel.findAll({
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
exports.RestoreSoftDeletedSponsor = Trackerror(async (req, res, next) => {
  const data = await SponsorModel.findOne({
    paranoid: false,
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const restoredata = await SponsorModel.restore({
    where: { _id: req.params.id },
  });
  res.status(200).json({
    success: true,
    restoredata,
  });
});
exports.SponsorMassUpload = Trackerror(async (req, res, next) => {
  if (!req.files || !req.files.file) {
    res.status(404).json({ message: "File not found" });
  } else if (req.files.file.mimetype === "application/json") {
    let de = JSON.parse(req.files.file.data.toString("utf8"));
    // console.log(de);
    let original = [];
    // let ShortCodeValidation = [];
    // await de.map((data) => {
    //   ShortCodeValidation.push(data.shortCode);
    // });
    // const Duplicates = await SponsorModel.findAll({
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
    await de.map((data) => {
      original.push({
        // shortCode: data.shortCode,
        NameEn: data.NameEn,
        NameAr: data.NameAr,
        DescriptionAr: data.DescriptionAr || data.NameAr,
        TitleEn: data.TitleEn || data.NameEn,
        DescriptionAr: data.DescriptionAr || data.NameAr,
        DescriptionEn: data.DescriptionEn || data.NameEn,
        BackupId: data.id,
      });
    });

    try {
      const data = await SponsorModel.bulkCreate(original);
      // /{ validate: true }
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
exports.CreateSponsor = Trackerror(async (req, res, next) => {
  const { DescriptionEn, DescriptionAr, TitleEn, TitleAr, Url } = req.body;
  console.log(req.files);
  if (req.files == null) {
    const data = await SponsorModel.create({
      DescriptionEn: DescriptionEn,
      DescriptionAr: DescriptionAr,
      TitleEn: TitleEn,
      TitleAr: TitleAr,
      Url: Url,
    });
    res.status(200).json({
      success: true,
      data,
    });
  } else {
    const file = req.files.image;
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${Sponsor}/${Image}`, file.mimetype);

    const data = await SponsorModel.create({
      image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Sponsor}/${Image}`,
      DescriptionEn: DescriptionEn,
      DescriptionAr: DescriptionAr,
      TitleEn: TitleEn,
      TitleAr: TitleAr,
      Url: Url,
    });
    res.status(201).json({
      success: true,
      data,
    });
  }
});
exports.SponsorGet = Trackerror(async (req, res, next) => {
  const totalcount = await SponsorModel.count();
  const data = await SponsorModel.findAll({
    offset: Number(req.query.page) - 1 || 0,
    limit: Number(req.query.limit) || 10,
    order: [[req.query.orderby || "createdAt", req.query.sequence || "ASC"]],
    where: {
      TitleEn: {
        [Op.like]: `%${req.query.TitleEn || ""}%`,
      },
      TitleAr: {
        [Op.like]: `%${req.query.TitleAr || ""}%`,
      },
      DescriptionEn: {
        [Op.like]: `%${req.query.DescriptionEn || ""}%`,
      },
      DescriptionAr: {
        [Op.like]: `%${req.query.DescriptionAr || ""}%`,
      },
      // shortCode: {
      //   [Op.like]: `%${req.query.shortCode || ""}%`,
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
exports.GetSponsorAdmin = Trackerror(async (req, res, next) => {});
exports.EditSponsor = Trackerror(async (req, res, next) => {
  const { DescriptionEn, DescriptionAr, TitleEn, TitleAr, Url } = req.body;
  let data = await SponsorModel.findOne({
    where: { _id: req.params.id },
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  if (req.files == null) {
    const updateddata = {
      image: data.image,
      DescriptionEn: DescriptionEn || data.DescriptionEn,
      DescriptionAr: DescriptionAr || data.DescriptionAr,
      TitleEn: TitleEn || data.TitleEn,
      TitleAr: TitleAr || data.TitleAr,
      Url: Url || data.Url,
    };
    data = await SponsorModel.update(updateddata, {
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
    await deleteFile(`${Sponsor}/${data.image}`);
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${Sponsor}/${Image}`, file.mimetype);

    const updateddata = {
      image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Sponsor}/${Image}`,
      DescriptionEn: DescriptionEn || data.DescriptionEn,
      DescriptionAr: DescriptionAr || data.DescriptionAr,
      TitleEn: TitleEn || data.TitleEn,
      TitleAr: TitleAr || data.TitleAr,
      Url: Url || data.Url,
    };

    data = await SponsorModel.update(updateddata, {
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
exports.DeleteSponsor = Trackerror(async (req, res, next) => {
  const data = await SponsorModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);
  await deleteFile(`${Sponsor}/${data.image.slice(-64)}`);
  await SponsorModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteSponsor = Trackerror(async (req, res, next) => {
  const data = await SponsorModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await SponsorModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "Soft Delete Successfully",
  });
});
