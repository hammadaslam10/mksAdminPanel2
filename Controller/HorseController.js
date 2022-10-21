const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const TrainerModel = require("../Models/TrainerModel");
const HorseModel = require("../Models/HorseModel");
const OwnerModel = require("../Models/OwnerModel");
const Features = require("../Utils/Features");
const { uploadFile, deleteFile } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const { Horse } = require("../Utils/Path");

exports.GetHorse = Trackerror(async (req, res, next) => {
  const data = await HorseModel.findAll({
    include: { all: true, nested: true },
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.SingleHorse = Trackerror(async (req, res, next) => {});
exports.CreateHorse = Trackerror(async (req, res, next) => {
  const {
    Age,
    NameEn,
    NameAr,
    Owner,
    ActiveTrainer,
    Breeder,
    Trainer,
    Remarks,
    HorseRating,
    Sex,
    Color,
    KindOfHorse,
    Dam,
    Sire,
    GSire,
    Earning,
    History,
    OverAllRating,
    ActiveJockey,
    ActiveOwner,
    Jockey,
  } = req.body;
  const file = req.files.image;
  const Image = generateFileName();
  const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
  await uploadFile(fileBuffer, `${Horse}/${Image}`, file.mimetype);
  const data = await HorseModel.create({
    HorseImage: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Horse}/${Image}`,
    NameEn: NameEn,
    Age: Age,
    NameAr: NameAr,
    Owner: Owner,
    ActiveTrainer: ActiveTrainer,
    Breeder: Breeder,
    Trainer: Trainer,
    Remarks: Remarks,
    HorseRating: HorseRating,
    Sex: Sex,
    Color: Color,
    KindOfHorse: KindOfHorse,
    Dam: Dam,
    Sire: Sire,
    GSire: GSire,
    Earning: Earning,
    History: History,
    OverAllRating: OverAllRating,
    ActiveJockey: ActiveJockey,
    Jockey: Jockey,
    ActiveOwner: ActiveOwner,
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.UpdateHorse = Trackerror(async (req, res, next) => {});
exports.DeleteHorse = Trackerror(async (req, res, next) => {});
