const db = require("../config/Connection");
const NewsModel = db.NewsModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { News } = require("../Utils/Path");
const { uploadFile, deleteFile } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const Features = require("../Utils/Features");
const { Op } = require("sequelize");
const { getPagination, getPagingData } = require("../Utils/Pagination");
exports.GetDeletedNews = Trackerror(async (req, res, next) => {
  const data = await NewsModel.findAll({
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
exports.NewsTicker = Trackerror(async (req, res, next) => {
  const data = await NewsletterModel.findAll({
    attributes: ["TitleEn", "TitleAr"],
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.RestoreSoftDeletedNews = Trackerror(async (req, res, next) => {
  const data = await NewsModel.findOne({
    paranoid: false,
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const restoredata = await NewsModel.restore({
    where: { _id: req.params.id },
  });
  res.status(200).json({
    success: true,
    restoredata,
  });
});

exports.CreateNewsAndBlog = Trackerror(async (req, res, next) => {
  const {
    DescriptionEn,
    DescriptionAr,
    TitleEn,
    TitleAr,
    SecondTitleEn,
    SecondTitleAr,
  } = req.body;

  const file = req.files.image;
  if (file == null) {
    return next(new HandlerCallBack("Please upload an image", 404));
  }
  const Image = generateFileName();
  const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
  await uploadFile(fileBuffer, `${News}/${Image}`, file.mimetype);
  const data = await NewsModel.create({
    image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${News}/${Image}`,
    DescriptionEn: DescriptionEn,
    DescriptionAr: DescriptionAr,
    SecondTitleEn: SecondTitleEn,
    SecondTitleAr: SecondTitleAr,
    TitleEn: TitleEn,
    TitleAr: TitleAr,
  });
  res.status(201).json({
    success: true,
    data,
  });
});
exports.SearchNews = Trackerror(async (req, res, next) => {});
exports.NewsGet = Trackerror(async (req, res, next) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page - 1, size);
  await NewsModel.findAndCountAll({
    order: [[req.query.orderby || "createdAt", req.query.sequence || "ASC"]],
    where: {
      TitleEn: {
        [Op.like]: `%${req.query.TitleEn || ""}%`,
      },
      TitleAr: {
        [Op.like]: `%${req.query.TitleAr || ""}%`,
      },
      SecondTitleEn: {
        [Op.like]: `%${req.query.SecondTitleEn || ""}%`,
      },
      SecondTitleAr: {
        [Op.like]: `%${req.query.SecondTitleAr || ""}%`,
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

exports.EditNews = Trackerror(async (req, res, next) => {
  const {
    DescriptionEn,
    DescriptionAr,
    TitleEn,
    TitleAr,
    SecondTitleEn,
    SecondTitleAr,
  } = req.body;
  let data = await NewsModel.findOne({
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
      SecondTitleEn: SecondTitleEn || data.SecondTitleEn,
      SecondTitleAr: SecondTitleAr || data.SecondTitleAr,
    };
    data = await NewsModel.update(updateddata, {
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
    await deleteFile(`${News}/${data.image}`);
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${News}/${Image}`, file.mimetype);
    const updateddata = {
      image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${News}/${Image}`,
      DescriptionEn: DescriptionEn || data.DescriptionEn,
      DescriptionAr: DescriptionAr || data.DescriptionAr,
      TitleEn: TitleEn || data.TitleEn,
      TitleAr: TitleAr || data.TitleAr,
      SecondTitleEn: SecondTitleEn || data.SecondTitleEn,
      SecondTitleAr: SecondTitleAr || data.SecondTitleAr,
    };

    data = await NewsModel.update(updateddata, {
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
exports.SoftDeleteNews = Trackerror(async (req, res, next) => {
  const data = await NewsModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await NewsModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "Soft Delete Successfully",
  });
});
exports.DeleteNews = Trackerror(async (req, res, next) => {
  const data = await NewsModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);
  await deleteFile(`${News}/${data.image.slice(-64)}`);
  await NewsModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
