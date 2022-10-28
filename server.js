const app = require("./app");
const Db = require("./config/Connection");
const { Server } = require("socket.io");
const { AdsGet } = require("./Controller/AdvertismentController");
const db = require("./config/Connection");
const AdvertismentModel = db.AdvertismentModel;
const Trackerror = require("./Middleware/TrackError");
process.on("uncaughtException", (err) => {
  console.log(`Error ${err.message}`);
  console.log(`Shutting down the server due to unhandled exception`);
  process.exit(1);
});
async () => {
  try {
    await Db.authenticate();
    console.log(Db);
    console.log("done");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "./config/Secrets.env" });
}

const server = app.listen(process.env.PORT || 8081, () => {
  console.log(`Server is working on port http:localhost:${process.env.PORT}`);
});
const io = new Server(server);
io.on("connection", (socket) => {
  console.log("hello socket");
  socket.emit(
    "Ads",
    Trackerror(async (req, res, next) => {
      const data = await AdvertismentModel.findAll();
      io.emit(data);
    })
  );
  socket.on("message", async function (msg) {
    const data = await AdvertismentModel.findAll();
    msg = data;
    io.emit(msg);
    io.emit(JSON.stringify(data));
  });
});
process.on("unhandledRejection", (err) => {
  console.log(`Error ${err.message}`);
  console.log(`Shutting down the server due to Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
