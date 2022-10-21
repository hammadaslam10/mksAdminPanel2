const app = require("./app");
const Db = require("./config/Connection");
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

process.on("unhandledRejection", (err) => {
  console.log(`Error ${err.message}`);
  console.log(`Shutting down the server due to Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
