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
exports.CreateSponsor = Trackerror(async (req, res, next) => {
  const { DescriptionEn, DescriptionAr, TitleEn, TitleAr, Url } = req.body;
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

});
exports.SponsorGet = Trackerror(async (req, res, next) => {
  const data = await SponsorModel.findAll();
  res.status(200).json({
    success: true,
    data: data,
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
    if (
      ArRegex.test(DescriptionAr) &&
      ArRegex.test(TitleAr) &&
      ArRegex.test(DescriptionEn) == false &&
      ArRegex.test(TitleEn) == false
    ) {
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
      return next(
        new HandlerCallBack("Please Fill Data To appropiate fields", 404)
      );
    }
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
    if (
      ArRegex.test(updateddata.DescriptionAr) &&
      ArRegex.test(updateddata.TitleAr) &&
      ArRegex.test(updateddata.DescriptionEn) == false &&
      ArRegex.test(updateddata.TitleEn) == false
    ) {
      data = await SponsorModel.update(updateddata, {
        where: {
          _id: req.params.id,
        },
      });
    } else {
      return next(
        new HandlerCallBack("Please Fill Data To appropiate fields", 404)
      );
    }
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
