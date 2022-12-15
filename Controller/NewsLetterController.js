const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const EmailDispatch = require("../Utils/EmailDispatch");
exports.AddNewsLetter = Trackerror(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new HandlerCallBack("Please Enter Email first", 500));
  }

  try {
    await EmailDispatch({
      email: email,
      subject: "Mks Email Received",
      message: "Testing News Letter Email",
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${email} successfully`,
    });
  } catch (error) {
    return next(new HandlerCallBack(error.message, 500));
  }
});
