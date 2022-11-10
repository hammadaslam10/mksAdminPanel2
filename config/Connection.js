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
db.SubscriberModel = require("../Models/SubscriberModel")(Db, DataTypes);
db.HorseModel = require("../Models/HorseModel")(Db, DataTypes);
db.OwnerModel = require("../Models/OwnerModel")(Db, DataTypes);
db.JockeyModel = require("../Models/JockeyModel")(Db, DataTypes);
db.TrainerModel = require("../Models/TrainerModel")(Db, DataTypes);
db.RaceCourseModel = require("../Models/RaceCourseModel")(Db, DataTypes);
db.AdvertismentModel = require("../Models/AdvertismentModel")(Db, DataTypes);
db.NewsModel = require("../Models/NewsModel")(Db, DataTypes);
db.RaceModel = require("../Models/RaceModel")(Db, DataTypes);
db.ResultModel = require("../Models/ResultsModel")(Db, DataTypes);
db.SliderModel = require("../Models/SliderModel")(Db, DataTypes);
db.SponsorModel = require("../Models/SponsorModel")(Db, DataTypes);
db.RaceAndHorseModel = require("../Models/RaceAndHorseModel")(Db, DataTypes);
db.RaceAndJockeyModel = require("../Models/RaceAndJockeyModel")(Db, DataTypes);
db.BreederModel = require("../Models/BreederModel")(Db, DataTypes);
db.ColorModel = require("../Models/ColorModel")(Db, DataTypes);
db.CurrencyModel = require("../Models/CurrencyModel")(Db, DataTypes);
db.CompetitionRacesPointsModel =
  require("../Models/CompetitionRacesPointsModel")(Db, DataTypes);
db.SeokeywordModel = require("../Models/SeoKeywordModel")(Db, DataTypes);
db.CompetitonModel = require("../Models/CompetitonModel")(Db, DataTypes);
db.SexModel = require("../Models/SexModel")(Db, DataTypes);
db.NationalityModel = require("../Models/NationalityModel")(Db, DataTypes);
db.CompetitonWinnersModel = require("../Models/CompetitonWinnersModel")(
  Db,
  DataTypes
);
db.CompetitionCategoryModel = require("../Models/CompetitionCategoryModel")(
  Db,
  DataTypes
);
db.CompetitionRacesModel = require("../Models/CompetitionRacesModel")(
  Db,
  DataTypes
);
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
db.AdminModel = require("../Models/AdminModel")(Db, DataTypes);
db.sequelize.sync({ force: false }).then(() => {
  console.log("yes re-sync done!");
});
// db.RaceModel.belongsTo(db.JockeyModel, {
//   foreignKey: "ActiveJockeyForTheRace",
//   as: "ActiveJockeyForTheRaceData",
// });
db.BreederModel.belongsTo(db.HorseModel, {
  foreignKey: "Breeder",
  as: "BreederData",
});
db.HorseModel.hasMany(db.BreederModel, {
  foreignKey: "Breeder",
  as: "BreederData",
});
db.NationalityModel.belongsTo(db.HorseModel, {
  foreignKey: "NationalityId",
  as: "NationalityData",
});
db.HorseModel.hasMany(db.NationalityModel, {
  foreignKey: "NationalityId",
  as: "NationalityData",
});
db.OwnerModel.belongsTo(db.ColorModel, {
  foreignKey: "SilkColor",
  as: "SilkColorData",
});
db.ColorModel.hasMany(db.OwnerModel, {
  foreignKey: "SilkColor",
  as: "SilkColorData",
});
db.HorseModel.belongsTo(db.ColorModel, {
  foreignKey: "ColorID",
  as: "ColorIDData",
});
db.ColorModel.hasMany(db.HorseModel, {
  foreignKey: "ColorID",
  as: "ColorIDData",
});
db.RaceModel.belongsTo(db.RaceCourseModel, {
  foreignKey: "RaceCourse",
  as: "RaceCourseData",
});

db.RaceModel.belongsToMany(db.HorseModel, {
  through: "RaceAndHorseModel",
});
db.HorseModel.belongsToMany(db.RaceModel, {
  through: "RaceAndHorseModel",
});
db.RaceModel.belongsToMany(db.JockeyModel, {
  through: "RaceAndJockeyModel",
});
db.JockeyModel.belongsToMany(db.RaceModel, {
  through: "RaceAndJockeyModel",
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
db.HorseModel.hasMany(db.ResultModel, {
  foreignKey: "HorseId",
  as: "HorseIdData",
});
db.ResultModel.belongsTo(db.HorseModel, {
  foreignKey: "HorseId",
  as: "HorseIdDataHorse",
});
db.RaceModel.hasMany(db.ResultModel, {
  foreignKey: "RaceId",
  as: "RaceIdData",
});
db.ResultModel.belongsTo(db.RaceModel, {
  foreignKey: "RaceId",
  as: "RaceIdDataHorse",
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
