const db = require("../config/Connection");
const ImagesStorageModel = db.ImagesStorageModel;
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { ImagesStorages } = require("../Utils/Path");
const { uploadFile, deleteFile } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const { Op } = require("sequelize");
const { getPagination, getPagingData } = require("../Utils/Pagination");
exports.GetDeletedImagesStorage = Trackerror(async (req, res, next) => {
  const data = await ImagesStorageModel.findAll({
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
exports.RestoreSoftDeletedImagesStorage = Trackerror(async (req, res, next) => {
  const data = await ImagesStorageModel.findOne({
    paranoid: false,
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const restoredata = await ImagesStorageModel.restore({
    where: { _id: req.params.id },
  });
  res.status(200).json({
    success: true,
    restoredata,
  });
});
exports.CreateImagesStorage = Trackerror(async (req, res, next) => {
  const { Title } = req.body;
  const file = req.files.image;
  if (file == null) {
    return next(new HandlerCallBack("Please upload an image", 404));
  }
  const Image = generateFileName();
  const data = await ImagesStorageModel.create({
    image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${ImagesStorages}/${Image}`,
    Title: Title,
  });
  const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
  await uploadFile(fileBuffer, `${ImagesStorages}/${Image}`, file.mimetype);

  res.status(201).json({
    success: true,
    data,
  });
});
exports.ImagesStoragesGet = Trackerror(async (req, res, next) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page - 1, size);
  await ImagesStorageModel.findAndCountAll({
    order: [[req.query.orderby || "createdAt", req.query.sequence || "ASC"]],
    where: {
      Title: {
        [Op.like]: `%${req.query.Title || ""}%`,
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
exports.GetImagesStoragesImagesStoragemin = Trackerror(
  async (req, res, next) => {}
);
exports.EditImagesStorages = Trackerror(async (req, res, next) => {
  const { Title } = req.body;
  let data = await ImagesStorageModel.findOne({
    where: { _id: req.params.id },
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  if (req.files == null) {
    const updateddata = {
      image: data.image,
      Title: Title || data.Title,
    };
    data = await ImagesStorageModel.update(updateddata, {
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
    await deleteFile(`${ImagesStorages}/${data.image}`);
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${ImagesStorages}/${Image}`, file.mimetype);
    const updateddata = {
      image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${ImagesStorages}/${Image}`,
      Title: Title || data.Title,
    };

    data = await ImagesStorageModel.update(updateddata, {
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
exports.DeleteImagesStorages = Trackerror(async (req, res, next) => {
  const data = await ImagesStorageModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);
  await deleteFile(`${ImagesStorages}/${data.image.slice(-64)}`);
  await ImagesStorageModel.troy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteImagesStorages = Trackerror(async (req, res, next) => {
  const data = await ImagesStorageModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await ImagesStorageModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "Soft Delete Successfully",
  });
});
exports.ImagesStoragesGetlive = Trackerror(async (req, res, next) => {});
