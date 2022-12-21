const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const EmailDispatch = require("../Utils/EmailDispatch");
const db = require("../config/Connection");

const NewsletterModel = db.NewsLetterModel;
// const { Op } = require("sequelize");
// exports.GetDeletedAdvertisment = Trackerror(async (req, res, next) => {
//   const data = await AdvertismentModel.findAll({
//     paranoid: false,
//     where: {
//       [Op.not]: { deletedAt: null },
//     },
//   });
//   res.status(200).json({
//     success: true,
//     data,
//   });
// });
// exports.RestoreSoftDeletedAdvertisment = Trackerror(async (req, res, next) => {
//   const data = await AdvertismentModel.findOne({
//     paranoid: false,
//     where: { _id: req.params.id },
//   });
//   if (!data) {
//     return next(new HandlerCallBack("data not found", 404));
//   }
//   const restoredata = await AdvertismentModel.restore({
//     where: { _id: req.params.id },
//   });
//   res.status(200).json({
//     success: true,
//     restoredata,
//   });
// });

exports.AddNewsLetter = Trackerror(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new HandlerCallBack("Please Enter Email first", 500));
  }

  try {
    await EmailDispatch({
      email: email,
      subject: "Mks Email Received",
      message: "Testing News Letter Email"
    });
    await NewsletterModel.create({
      Email: email
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${email} successfully`
    });
  } catch (error) {
    return next(new HandlerCallBack(error.message, 500));
  }
});
exports.GetNewsLetter = Trackerror(async (req, res, next) => {
  const data = await NewsletterModel.findAll({});
  res.status(200).json({
    success: true,
    data
  });
});
