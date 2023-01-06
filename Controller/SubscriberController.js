const db = require("../config/Connection");
const SubscriberModel = db.SubscriberModel;
const HorseModel = db.HorseModel;
const Trackerror = require("../Middleware/TrackError");
const TokenCreation = require("../Utils/TokenCreation");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const EmailDispatch = require("../Utils/EmailDispatch");
const { Subscriber } = require("../Utils/Path");
const { uploadFile, deleteFile, getObjectSignedUrl } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const bcrypt = require("bcrypt");
const SubscriberAndHorsesModel = db.SubscriberAndHorsesModel;
const SubscriberAndTrainerModel = db.SubscriberAndTrainerModel;
const SubscriberAndOwnerModel = db.SubscriberAndOwnerModel;
const { Op } = require("sequelize");
const _ = require("lodash");
exports.SearchUser = Trackerror(async (req, res, next) => {
  console.log(req.query.createdAt);
  if (req.query.createdAt) {
    console.log(req.query.createdAt);
    const data = await SubscriberModel.findAll({
      where: {
        FirstName: {
          [Op.like]: `%${req.query.FirstName || ""}%`,
        },
        LastName: {
          [Op.like]: `%${req.query.LastName || ""}%`,
        },
        PassportNo: {
          [Op.like]: `%${req.query.PassportNo || ""}%`,
        },
        ApprovedStatus: {
          [Op.like]: `%${req.query.ApprovedStatus || ""}%`,
        },
        Address: {
          [Op.like]: `%${req.query.Address || ""}%`,
        },
        password: {
          [Op.like]: `%${req.query.password || ""}%`,
        },
        Email: {
          [Op.like]: `%${req.query.Email || ""}%`,
        },
        PhoneNumber: {
          [Op.like]: `%${req.query.PhoneNumber || ""}%`,
        },
        PassportPicture: {
          [Op.like]: `%${req.query.PassportPicture || ""}%`,
        },
        createdAt: {
          [Op.between]: [req.query.startdate, req.query.endDate],
        },
      },
    });
    res.status(200).json({
      success: true,
      data,
    });
  } else {
    const data = await SubscriberModel.findAll({
      where: {
        FirstName: {
          [Op.like]: `%${req.query.FirstName || ""}%`,
        },
        LastName: {
          [Op.like]: `%${req.query.LastName || ""}%`,
        },
        PassportNo: {
          [Op.like]: `%${req.query.PassportNo || ""}%`,
        },
        ApprovedStatus: {
          [Op.like]: `%${req.query.ApprovedStatus || ""}%`,
        },
        Address: {
          [Op.like]: `%${req.query.Address || ""}%`,
        },
        password: {
          [Op.like]: `%${req.query.password || ""}%`,
        },
        Email: {
          [Op.like]: `%${req.query.Email || ""}%`,
        },
        PhoneNumber: {
          [Op.like]: `%${req.query.PhoneNumber || ""}%`,
        },
        PassportPicture: {
          [Op.like]: `%${req.query.PassportPicture || ""}%`,
        },
        // createdAt: {
        //   [Op.like]: `%${req.query.createdAt || ""}%`,
        // },
        // updatedAt: {
        //   [Op.like]: `%${req.query.updatedAt || ""}%`,
        // },
      },
    });
    res.status(200).json({
      success: true,
      data,
    });
  }
});
exports.GetDeletedSubscriber = Trackerror(async (req, res, next) => {
  const data = await SubscriberModel.findAll({
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
exports.RestoreSoftDeletedSubscriber = Trackerror(async (req, res, next) => {
  const data = await SubscriberModel.findOne({
    paranoid: false,
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const restoredata = await SubscriberModel.restore({
    where: { _id: req.params.id },
  });
  res.status(200).json({
    success: true,
    restoredata,
  });
});
exports.TrackOwners = Trackerror(async (req, res, next) => {
  const { Owner } = req.body;
  const { token } = req.cookies;
  if (!token) {
    return next(
      new HandlerCallBack("Please login to access this resource", 401)
    );
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  let verify = await SubscriberModel.findOne({
    where: { _id: decodedData.id },
  });
  if (!verify) {
    return next(new HandlerCallBack(`Error during Resgistration `));
  } else {
    const data = await SubscriberAndOwnerModel.findOrCreate({
      where: {
        SubscriberModelId: verify._id,
        OwnerModelId: Owner,
      },
    });
    res.status(200).json({
      success: true,
      data,
    });
  }
});
exports.TrackTrainers = Trackerror(async (req, res, next) => {
  const { Trainer } = req.body;
  const { token } = req.cookies;
  if (!token) {
    return next(
      new HandlerCallBack("Please login to access this resource", 401)
    );
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  let verify = await SubscriberModel.findOne({
    where: { _id: decodedData.id },
  });
  if (!verify) {
    return next(new HandlerCallBack(`user not verified `));
  } else {
    const data = await SubscriberAndTrainerModel.findOrCreate({
      where: {
        SubscriberModelId: verify._id,
        TrainerModelId: Trainer,
      },
    });
    res.status(200).json({
      success: true,
      data,
    });
  }
});
exports.TrackHorses = Trackerror(async (req, res, next) => {
  const { Horse } = req.body;
  const { token } = req.cookies;
  if (!token) {
    return next(
      new HandlerCallBack("Please login to access this resource", 401)
    );
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  let verify = await SubscriberModel.findOne({
    where: { _id: decodedData.id },
  });
  if (!verify) {
    return next(new HandlerCallBack(`user not verified `));
  } else {
    const data = await SubscriberAndHorsesModel.findOrCreate({
      where: {
        SubscriberModelId: verify._id,
        HorseModelId: Horse,
      },
    });
    res.status(200).json({
      success: true,
      data,
    });
  }
});
exports.RegisterSubscriber = Trackerror(async (req, res, next) => {
  const Features = require("../Utils/Features");
  const {
    FirstName,
    LastName,
    PassportNo,
    PhoneNumber,
    password,
    Email,
    Address,
    NationalityID,
    DOB,
  } = req.body;
  const file = req.files.PassportPicture;
  let Image = generateFileName();
  const fileBuffer = await resizeImageBuffer(
    req.files.PassportPicture.data,
    214,
    212
  );
  if (password) {
    await uploadFile(fileBuffer, `${Subscriber}/${Image}`, file.mimetype);
    const data = await SubscriberModel.create({
      FirstName: FirstName,
      LastName: LastName,
      PassportNo: PassportNo,
      PhoneNumber: PhoneNumber,
      password: await bcrypt.hash(password, 10),
      Email: Email,
      PassportPicture: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Subscriber}/${Image}`,
      Address: Address,
      NationalityID: NationalityID,
      DOB: DOB,
    });
    TokenCreation(data, 201, res);
  }
  return next(new HandlerCallBack(`Error during Registration `));
});
exports.GetAllSubscriber = Trackerror(async (req, res, next) => {
  const data = await SubscriberModel.findAll();
  res.status(201).json({
    success: true,
    data,
  });
});
exports.GetonlyoneSusbcriber = Trackerror(async (req, res, next) => {
  const data = await SubscriberModel.findOne({
    where: { _id: req.params.id },
    include: [
      {
        paranoid: false,
        model: db.HorseModel,
        as: "TrackHorses",
      },
      {
        paranoid: false,
        model: db.TrainerModel,
        as: "TrackTrainers",
      },
      {
        model: db.OwnerModel,
        as: "TrackOwners",
        paranoid: false,
      },
      {
        paranoid: false,
        model: db.SubscriberAndCompetitionModel,
        as: "CompetitionSubscriberIDData",
      },
      {
        paranoid: false,
        model: db.RaceNameModel,
        as: "RaceNameModelData",
      },
    ],
  });
  if (!data) {
    return next(new HandlerCallBack(`user not found `));
  }
  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.DeleteSubscriber = Trackerror(async (req, res, next) => {
  const data = await SubscriberModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);
  await deleteFile(`${Subscriber}/${data.image.slice(-64)}`);
  await SubscriberModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteAds = Trackerror(async (req, res, next) => {
  const data = await SubscriberModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await SubscriberModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "Soft Delete Successfully",
  });
});
exports.SubscriberApproval = Trackerror(async (req, res, next) => {
  let data = await SubscriberModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack(`user not found`));
  }
  data = await SubscriberModel.update(
    { ApprovedStatus: 1 },
    {
      where: {
        _id: req.params.id,
      },
    }
  );
  res.status(200).json({
    success: true,
    message: "user status update successfull",
  });
});
exports.LoginSubscriber = Trackerror(async (req, res, next) => {
  const { Email, password } = req.body;

  if (!Email || !password) {
    return next(new HandlerCallBack("Please enter password and Email", 400));
  }

  const user = await SubscriberModel.findOne({
    where: { Email: Email },
  });

  if (!user) {
    return next(new HandlerCallBack("Invalid Email or Password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);
  console.log(isPasswordMatched);
  if (!isPasswordMatched) {
    return next(new HandlerCallBack("Email or password is incorrect", 401));
  }

  TokenCreation(user, 200, res);
});
// exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
//   const resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(req.params.token)
//     .digest("hex");

//   const user = await SubscriberModel.findOne({
//     resetPasswordToken,
//     resetPasswordExpire: { $gt: Date.now() },
//   });

//   if (!user) {
//     return next(
//       new ErrorHandler("Reset Password token is invalid or expired", 400)
//     );
//   }

//   if (req.body.password !== req.body.confirmPassword) {
//     return next(new ErrorHandler("Password does not match", 400));
//   }

//   user.password = req.body.password;
//   user.resetPasswordToken = undefined;
//   user.resetPasswordExpire = undefined;

//   await user.save();

//   sendToken(user, 200, res);
// });

exports.logOut = Trackerror(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

exports.forgotPassword = Trackerror(async (req, res, next) => {
  console.log(req.body.email);
  const user = await SubscriberModel.findOne({
    where: { Email: req.body.email },
  });

  if (!user) {
    return next(new HandlerCallBack("User not found", 404));
  }

  let resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have ot requested this email 
    then, ignore it`;
  resetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  console.log(resetPasswordUrl);
  console.log(resetToken);
  data = await SubscriberModel.update(
    { Token: resetToken },
    {
      where: {
        Email: req.body.email,
      },
    }
  );
  try {
    await EmailDispatch({
      email: user.Email,
      subject: "Mks  Racing password recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.Email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    return next(new HandlerCallBack(error.message, 500));
  }
});

exports.resetPassword = Trackerror(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  console.log(req.params.token);
  console.log(resetPasswordToken);
  const user = await SubscriberModel.findOne({
    where: {
      Token: resetPasswordToken,
    },
  });

  if (!user) {
    return next(
      new HandlerCallBack("Reset Password token is invalid or expired", 400)
    );
  }

  if (req.body.firstpassword !== req.body.confirmPassword) {
    return next(new HandlerCallBack("Password does not match", 400));
  }
  const updatedata = {
    password: await bcrypt.hash(req.body.firstpassword, 10),
    Token: undefined,
  };
  let data = await SubscriberModel.update(updatedata, {
    where: {
      Token: resetPasswordToken,
    },
  });

  res.status(200).json({
    data,
  });
});
exports.UpdateProfile = Trackerror(async (req, res, next) => {
  const {
    FirstName,
    LastName,
    PassportNo,
    PhoneNumber,
    Email,
    Address,
    NationalityID,
    DOB,
  } = req.body;
  let data = await SubscriberModel.findOne({
    where: { _id: req.params.id },
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  if (req.files == null) {
    const updateddata = {
      image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Subscriber}/${data.image}`,
      FirstName: FirstName || data.FirstName,
      LastName: LastName || data.LastName,
      PassportNo: PassportNo || data.PassportNo,
      PhoneNumber: PhoneNumber || data.PhoneNumber,
      Email: Email || data.Email,
      Address: Address || data.Address,
      NationalityID: NationalityID || data.NationalityID,
      DOB: DOB || data.DOB,
    };
    data = await SubscriberModel.update(updateddata, {
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
    await deleteFile(`${Subscriber}/${data.image}`);
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${Subscriber}/${Image}`, file.mimetype);
    const updateddata = {
      image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${Subscriber}/${Image}`,
      FirstName: FirstName || data.FirstName,
      LastName: LastName || data.LastName,
      PassportNo: PassportNo || data.PassportNo,
      PhoneNumber: PhoneNumber || data.PhoneNumber,
      Email: Email || data.Email,
      Address: Address || data.Address,
      NationalityID: NationalityID || data.NationalityID,
      DOB: DOB || data.DOB,
    };
    data = await SubscriberModel.update(updateddata, {
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
