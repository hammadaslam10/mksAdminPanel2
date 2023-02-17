const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const BodyParser = require("body-parser");
const Upload = require("express-fileupload");
const path = require("path");
const ApplyMiddleware = require("./Middleware/ErrorCallBackReturn");
const cors = require("cors");
const SubscriberRoutes = require("./Routes/SubsriberRoutes");
const JockeyRoutes = require("./Routes/JockeyRoutes");
const TrainerRoutes = require("./Routes/TrainerRoutes");
const OwnerRoutes = require("./Routes/OwnerRoutes");
const RaceCourseRoute = require("./Routes/RaceCourseRoute");
const NewsAndBlogRoutes = require("./Routes/NewsAndBlogRoutes");
const AdvertismentRoutes = require("./Routes/AdvertismentRoutes");
const SponsorRoutes = require("./Routes/SponsorRoutes");
const SliderRoutes = require("./Routes/SliderRoutes");
const HorseRoutes = require("./Routes/HorseRoutes");
const RaceRoutes = require("./Routes/RaceRoutes");
const NationalityRoutes = require("./Routes/NationalityRoutes");
const BreederRoutes = require("./Routes/BreederRoutes");
const CurrencyRoutes = require("./Routes/CurrencyRoutes");
const ColorRoutes = require("./Routes/ColorRoutes");
const SexRoutes = require("./Routes/SexRoutes");
const AdminRoutes = require("./Routes/AdminRoutes");
const SeoKeywordRoutes = require("./Routes/SeoKeywordRoutes");
const MeetingTypeRoutes = require("./Routes/MeetingTypeRoute");
const RaceNameRoutes = require("./Routes/RaceNameRoute");
const RaceTypeRoutes = require("./Routes/RaceTypeRoute");
const TrackLengthRoutes = require("./Routes/TrackLengthRoute");
const HorseKindRoutes = require("./Routes/HorseKindRoutes");
const RaceKindRoutes = require("./Routes/RaceKindRoutes");
const RaceCardRoutes = require("./Routes/RaceCardRoutes");
const EquipmentRoutes = require("./Routes/EquipmentRoutes");
const GroundTypeRoutes = require("./Routes/GroundTypeRoutes");
const VerdictRoute = require("./Routes/VerdictRoute");
const ComeptitionRoute = require("./Routes/CompetitionRoutes");
const CompetitionCategoryRoutes = require("./Routes/CompetitionCategoryRoutes");
const NewsLetterRoutes = require("./Routes/NewsLetterRoutes");
const PointTableSystemRoutes = require("./Routes/PointTableSystemRoutes");
const FinalPositionRoutes = require("./Routes/FinalPositionRoutes");
const ImageStorageRoutes = require("./Routes/ImagesStorageRoutes");
const EmailTemplateRoutes = require("./Routes/EmailTemplateRoutes");
const TrackConditionRoutes = require("./Routes/TrackConditionRoutes");
const { initializeApp } = require("firebase/app");

const firebaseConfig = {
  apiKey: "AIzaSyA5a_if_wOdeqra8uuD6DsC4QS9x04TALE",
  authDomain: "mksracing-87bea.firebaseapp.com",
  projectId: "mksracing-87bea",
  storageBucket: "mksracing-87bea.appspot.com",
  messagingSenderId: "942994803396",
  appId: "1:942994803396:web:c3376a97a3935c3d589791",
};

// Initialize Firebase
initializeApp(firebaseConfig);
let cron = require("node-cron");
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "./config/Secrets.env" });
}

app.use(express.json());
app.use(cookieParser());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(Upload());
app.use(cors());
// app.use(
//   cors({
//     origin: "*",
//   })
// );
app.use("/api/v1", SubscriberRoutes);
app.use("/api/v1", NewsAndBlogRoutes);
app.use("/api/v1", SponsorRoutes);
app.use("/api/v1", RaceCourseRoute);
app.use("/api/v1", JockeyRoutes);
app.use("/api/v1", AdvertismentRoutes);
app.use("/api/v1", TrainerRoutes);
app.use("/api/v1", HorseRoutes);
app.use("/api/v1", RaceRoutes);
app.use("/api/v1", SliderRoutes);
app.use("/api/v1", NationalityRoutes);
app.use("/api/v1", BreederRoutes);
app.use("/api/v1", ColorRoutes);
app.use("/api/v1", SexRoutes);
app.use("/api/v1", AdminRoutes);
app.use("/api/v1", SeoKeywordRoutes);
app.use("/api/v1", OwnerRoutes);
app.use("/api/v1", CurrencyRoutes);
app.use("/api/v1", MeetingTypeRoutes);
app.use("/api/v1", RaceNameRoutes);
app.use("/api/v1", RaceTypeRoutes);
app.use("/api/v1", TrackLengthRoutes);
app.use("/api/v1", HorseKindRoutes);
app.use("/api/v1", RaceKindRoutes);
app.use("/api/v1", RaceCardRoutes);
app.use("/api/v1", EquipmentRoutes);
app.use("/api/v1", GroundTypeRoutes);
app.use("/api/v1", VerdictRoute);
app.use("/api/v1", ComeptitionRoute);
app.use("/api/v1", CompetitionCategoryRoutes);
app.use("/api/v1", NewsLetterRoutes);
app.use("/api/v1", PointTableSystemRoutes);
app.use("/api/v1", TrackConditionRoutes);
app.use("/api/v1", FinalPositionRoutes);
app.use("/api/v1", ImageStorageRoutes);
app.use("/api/v1", EmailTemplateRoutes);
cron.schedule("* * * * *", () => {
  console.log("cron job working");
});
cron.schedule("* * * * *", () => {
  console.log("cron job working1");
});
app.use(ApplyMiddleware);

module.exports = app;
