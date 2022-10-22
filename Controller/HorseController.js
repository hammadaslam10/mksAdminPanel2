const db = require("../config/Connection");
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const TrainerModel = db.TrainerModel;
const HorseModel = db.HorseModel;
const OwnerModel = db.OwnerModel;
const JockeyModel = db.JockeyModel;
const Features = require("../Utils/Features");
const HorseJockeyComboModel = db.HorseJockeyComboModel;
const HorseOwnerComboModel = db.HorseOwnerComboModel;
const HorseTrainerComboModel = db.HorseTrainerComboModel;
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
// async function makePostWithReactions(content, reactionTypes) {
//   const post = await Post.create({ content });
//   await Reaction.bulkCreate(
//     reactionTypes.map((type) => ({ type, postId: post.id }))
//   );
//   return post;
// }
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

  // const QueryOwnerData = await OwnerModel.findAll({
  //   where: { _id: Owner },
  // });
  // console.log(QueryOwnerData);
  // if (true) {
  //   // if(){
  //   // }
  //   // if (typeof Owner === "string") {
  //   //   await OwnerModel.update(
  //   //     { Owner: data._id },
  //   //     {
  //   //       where: { _id: Owner },
  //   //     }
  //   //   );
  //   // } else {
  //   //   await Owner.map(async (singleOwner) => {
  //   //     await OwnerModel.update(
  //   //       { Owner: data._id },
  //   //       {
  //   //         where: { _id: singleOwner },
  //   //       }
  //   //     );
  //   //   });
  //   // }
  //   // const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
  //   // await uploadFile(fileBuffer, `${Horse}/${Image}`, file.mimetype);
  // } else {
  //   return next(new HandlerCallBack("Horse creation has its error", 401));
  // }
  // Owner.map(async (single) => {
  //   await OwnerModel.create();
  // });
  // await OwnerModel.update(
  //   { HorseThatOwned : data._id },
  //   {
  //     where: {
  //       _id: Owner,
  //     },
  //   }
  // );

  res.status(200).json({
    success: true,
    data,
  });
});
exports.UpdateHorse = Trackerror(async (req, res, next) => {});
exports.DeleteHorse = Trackerror(async (req, res, next) => {});
