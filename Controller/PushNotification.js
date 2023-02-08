const db = require("../config/Connection");
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
// const { getMessaging } = require("fcm-node");
var admin = require("firebase-admin");
var fcm = require("fcm-notification");
var serviceAccount = require("./mksracing-87bea-firebase-adminsdk-oyldy-7a7d6c1276.json");
const certPath = admin.credential.cert(serviceAccount);
var FCM = new fcm(certPath);
exports.GetSendNotification = Trackerror(async (req, res, next) => {
  sendPushNotification(
    "fvn_8K9fY727wo--nd9YBt:APA91bHCOJhed2vbcsMoorARb7aEzOkD5PddQnNJbnO1IWawffvUsjOPhB6jEHyvdMEQ4rwXIWcCRl5VBAEDmvNNOYhL9oB-QQFa1BrhkTu2cYxg-8PVBNZ2Tj3P_rPTkN73UOhUlDqQ",
    "title test",
    "body test"
  );
  res.status(200).json({
    success: true,
  });
});
sendPushNotification = (fcm_token, title, body) => {
  try {
    let message = {
      notification: {
        title: title,
        body: body,
      },

      token: fcm_token,
    };

    FCM.send(message, function (err, resp) {
      if (err) {
        throw err;
      } else {
        console.log("Successfully sent notification");
      }
    });
  } catch (err) {
    throw err;
  }
};
exports.TemplateChanging = Trackerror(async (req, res, next) => {
  const { email } = req.body;
  console.log(email);
  res.status(200).json({
    email,
  });
});
