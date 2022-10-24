const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config({ path: "./config/Secrets.env" });
const Db = new Sequelize(
  process.env.SQLDB,
  process.env.SQLHOST,
  process.env.SQLPASSWORD,
  {
    dialect: "mysql",
    // logging: false,
  }
);
Db.authenticate()
  .then(() => {
    console.log("connected..");
  })
  .catch((err) => {
    console.log("Error" + err);
  });
const db = {};
db.Sequelize = Sequelize;
db.sequelize = Db;
db.HorseModel = require("../Models/HorseModel")(Db, DataTypes);
db.OwnerModel = require("../Models/OwnerModel")(Db, DataTypes);
db.JockeyModel = require("../Models/JockeyModel")(Db, DataTypes);
db.TrainerModel = require("../Models/TrainerModel")(Db, DataTypes);
db.RaceCourseModel = require("../Models/RaceCourseModel")(Db, DataTypes);
db.AdvertismentModel = require("../Models/AdvertismentModel")(Db, DataTypes);
db.NewsModel = require("../Models/NewsModel")(Db, DataTypes);
db.RaceModel = require("../Models/RaceModel")(Db, DataTypes);
db.SliderModel = require("../Models/SliderModel")(Db, DataTypes);
db.SponsorModel = require("../Models/SponsorModel")(Db, DataTypes);
db.RaceAndCourseModel = require("../Models/RaceAndCourseModel")(Db, DataTypes);
db.HorseJockeyComboModel = require("../Models/HorseJockeyComboModel")(
  Db,
  DataTypes
);
db.HorseTrainerComboModel = require("../Models/HorseTrainerComboModel")(
  Db,
  DataTypes
);
db.HorseOwnerComboModel = require("../Models/HorseOwnerComboModel")(
  Db,
  DataTypes
);
db.sequelize.sync({ force: false }).then(() => {
  console.log("yes re-sync done!");
});

db.RaceModel.belongsTo(db.RaceCourseModel, {
  foreignKey: "RaceCourse",
  as: "RaceCourseData",
});
db.RaceModel.belongsToMany(db.RaceCourseModel, {
  through: "RaceAndCourseModel",
});
db.RaceCourseModel.belongsToMany(db.RaceModel, {
  through: "RaceAndCourseModel",
});
db.HorseModel.belongsToMany(db.OwnerModel, {
  through: "HorseOwnerComboModel",
});
db.OwnerModel.belongsToMany(db.HorseModel, {
  through: "HorseOwnerComboModel",
});
db.HorseModel.belongsToMany(db.JockeyModel, {
  through: "HorseJockeyComboModel",
});
db.JockeyModel.belongsToMany(db.HorseModel, {
  through: "HorseJockeyComboModel",
});
db.HorseModel.belongsToMany(db.TrainerModel, {
  through: "HorseTrainerComboModel",
});
db.TrainerModel.belongsToMany(db.HorseModel, {
  through: "HorseTrainerComboModel",
});

// var options = {
//   host: "database-2.cgk4a7qwslgi.us-west-1.rds.amazonaws.com",
//   port: 3306,
//   logging: console.log,
//   maxConcurrentQueries: 100,
//   dialect: "mysql",
//   ssl: "Amazon RDS",
//   pool: { maxDbions: 5, maxIdleTime: 30 },
//   language: "en",
//   Protocol: "TCP"
// };
// const Db = new Sequelize("mksracingdevtest", "admin", "abc.12345", {
//   ...options
// });

// module.exports = Db;
module.exports = db;

// db.HorseModel.belongsTo(db.JockeyModel, {
//   foreignKey: "ActiveJockey",
//   as: "ActiveJockeyData",
// });
// db.JockeyModel.hasOne(db.HorseModel, {
//   foreignKey: "ActiveJockey",
//   as: "ActiveJockeyData",
// });
// db.HorseModel.belongsTo(db.OwnerModel, {
//   foreignKey: "ActiveOwner",
//   as: "ActiveOwnerData",
// });
// db.OwnerModel.hasOne(db.HorseModel, {
//   foreignKey: "ActiveOwner",
//   as: "ActiveOwnerData",
// });
// db.HorseModel.belongsTo(db.TrainerModel, {
//   foreignKey: "ActiveTrainer",
//   as: "ActiveTrainerData",
// });
// db.TrainerModel.hasOne(db.HorseModel, {
//   foreignKey: "ActiveTrainer",
//   as: "ActiveTrainerData",

// db.HorseModel.belongsTo(db.JockeyModel, {
//   foreignKey: "ActiveJockey",
//   as: "ActiveJockeyData",
// });
// db.HorseModel.belongsTo(db.OwnerModel, {
//   foreignKey: "ActiveOwner",
//   as: "ActiveOwnerData",
// });
// db.HorseModel.belongsTo(db.TrainerModel, {
//   foreignKey: "ActiveTrainer",
//   as: "ActiveTrainerData",
// });
// db.HorseModel.hasMany(db.OwnerModel, {
//   foreignKey: "Owner",
//   as: "OwnerData",
// });
// db.OwnerModel.hasMany(db.HorseModel, {
//   foreignKey: "Owner",
//   as: "OwnerData",
// });
// db.HorseModel.hasMany(db.JockeyModel, {
//   foreignKey: "Jockey",
//   as: "JockeyData",
// });
// db.JockeyModel.belongsTo(db.HorseModel, {
//   foreignKey: "Jockey",
//   as: "JockeyData",
// });
// db.HorseModel.hasMany(db.TrainerModel, {
//   foreignKey: "Trainer",
//   as: "TrainerData",
// });
// db.TrainerModel.belongsTo(db.HorseModel, {
//   foreignKey: "Trainer",
//   as: "TrainerDataHorse",
// });
// });
