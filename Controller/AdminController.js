const db = require("../config/Connection");
const AdminModel = db.AdminModel;
const HorseModel = db.HorseModel;
const Trackerror = require("../Middleware/TrackError");
const TokenCreation = require("../Utils/TokenCreation");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const EmailDispatch = require("../Utils/EmailDispatch");
const { Admin } = require("../Utils/Path");
const { uploadFile, deleteFile, getObjectSignedUrl } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const bcrypt = require("bcrypt");
exports.RegisterAdmin = Trackerror(async (req, res, next) => {
  const Features = require("../Utils/Features");
  const { FirstName, LastName, PassportNo, PhoneNumber, password, Email } =
    req.body;
  if (password) {
    const data = await AdminModel.create({
      FirstName: FirstName,
      LastName: LastName,
      PassportNo: PassportNo,
      PhoneNumber: PhoneNumber,
      password: await bcrypt.hash(password, 10),
      Email: Email,
    });
    TokenCreation(data, 201, res);
  }
  return next(new HandlerCallBack(`Error during Resgistration `));
});
exports.GetAllAdmin = Trackerror(async (req, res, next) => {
  const data = await AdminModel.findAll();
  res.status(201).json({
    success: true,
    data,
  });
});
exports.GetonlyoneAdmin = Trackerror(async (req, res, next) => {
  const data = await AdminModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack(`user not found `));
  }

  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.DeleteAdmin = Trackerror(async (req, res, next) => {
  const data = await AdminModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  console.log(data);
  await deleteFile(`${Admin}/${data.image.slice(-64)}`);
  await AdminModel.destroy({
    where: { _id: req.params.id },
    force: true,
  });

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
exports.SoftDeleteAdmin = Trackerror(async (req, res, next) => {
  const data = await AdminModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await AdminModel.destroy({
    where: { _id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "Soft Delete Successfully",
  });
});
exports.AdminApproval = Trackerror(async (req, res, next) => {
  let data = await AdminModel.findOne({
    where: { _id: req.params.id },
  });
  if (!data) {
    return next(new HandlerCallBack(`user not found`));
  }
  data = await AdminModel.update(
    { role: "approveduser" },
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
exports.LoginAdmin = Trackerror(async (req, res, next) => {
  const { Email, password } = req.body;

  if (!Email || !password) {
    return next(new HandlerCallBack("Please enter password and Email", 400));
  }

  const user = await AdminModel.findOne({
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
// exports.TrackHorse = Trackerror(async (req, res, next) => {
//   let Horse = await HorseModel.findById(req.params.id);
//   const { token } = req.cookies;
//   if (!token) {
//     return next(
//       new HandlerCallBack("Please login to access this resource", 401)
//     );
//   }

//   const decodedData = jwt.verify(token, process.env.JWT_SECRET);

//   req.user = await AdminModel.findById(decodedData.id).select("+role");

//   let data = await AdminModel.findById(req.params.id, {
//     SoftDelete: 0,
//   }).select("+SoftDelete");
//   if (!data) {
//     return next(new HandlerCallBack(`user not found`));
//   }
//   data = await AdminModel.findByIdAndUpdate(
//     req.user._id,
//     { TrackHorse: `${Horse}` },
//     {
//       new: true,
//       runValidators: true,
//       useFindAndModify: false,
//     }
//   ).select("+SoftDelete");
//   res.status(200).json({
//     success: true,
//     message: "user status update successfull",
//   });
// });
exports.forgotPassword = Trackerror(async (req, res, next) => {
  const user = await AdminModel.findOne({ email: req.body.email });

  if (!user) {
    return next(new HandlerCallBack("User not found", 404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have ot requested this email 
    then, ignore it`;

  try {
    await EmailDispatch({
      email: user.email,
      subject: "Mks  Racing password recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new HandlerCallBack(err.message, 500));
  }
});

exports.resetPassword = Trackerror(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new HandlerCallBack("Reset Password token is invalid or expired", 400)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new HandlerCallBack("Password does not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  TokenCreation(user, 200, res);
});
