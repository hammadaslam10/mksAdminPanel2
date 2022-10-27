
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
// const AdminRoutes = require("./Routes/AdminRoutes");
// const SearchRoutes = require("./Routes/SearchRoutes");
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "./config/Secrets.env" });
}

app.use(express.json());
app.use(cookieParser());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(Upload());
app.use(cors());
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
// app.use("/api/v1", AdminRoutes);
app.use("/api/v1", OwnerRoutes);
// app.use("/api/v1", SearchRoutes);

app.use(ApplyMiddleware);
module.exports = app;
