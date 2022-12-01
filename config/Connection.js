const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config({ path: "./config/Secrets.env" });
var options = {
  host: process.env.RDSHOST,
  port: 3306,
  logging: console.log,
  // maxConcurrentQueries: 100,
  dialect: "mysql",
  ssl: process.env.RDSSSL,
  // pool: { maxDbions: 5, maxIdleTime: 30 },
  language: "en",
  Protocol: "TCP",
};
const Db = new Sequelize(
  process.env.RDSDB,
  process.env.RDSUSER,
  process.env.RDSPASSWORD,
  {
    ...options,
  }
);

// const Db = new Sequelize(
//   process.env.SQLDB,
//   process.env.SQLHOST,
//   process.env.SQLPASSWORD,
//   {
//     dialect: "mysql",
//     // logging: false,
//   }
// );

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
db.RaceKindModel = require("../Models/RaceKindModel")(Db, DataTypes);
db.CurrencyModel = require("../Models/CurrencyModel")(Db, DataTypes);
db.CompetitionRacesPointsModel =
  require("../Models/CompetitionRacesPointsModel")(Db, DataTypes);
db.SeokeywordModel = require("../Models/SeoKeywordModel")(Db, DataTypes);
db.CompetitonModel = require("../Models/CompetitonModel")(Db, DataTypes);
db.SexModel = require("../Models/SexModel")(Db, DataTypes);
db.NationalityModel = require("../Models/NationalityModel")(Db, DataTypes);
db.MeetingTypeModel = require("../Models/MeetingTypeModel")(Db, DataTypes);
db.TrackLengthModel = require("../Models/TrackLengthModel")(Db, DataTypes);
db.HorseKindModel = require("../Models/HorseKindModel")(Db, DataTypes);
db.OwnerSilkColorModel = require("../Models/OwnerSilkColorModel")(
  Db,
  DataTypes
);
db.EmailTemplateModel = require("../Models/EmailTemplateModel")(Db, DataTypes);
db.RaceCardModel = require("../Models/RaceCardModel")(Db, DataTypes);
db.RaceAndVerdictsJockeyModel = require("../Models/RaceAndVerdictsJockeyModel")(
  Db,
  DataTypes
);
db.RaceAndVerdictsHorseModel = require("../Models/RaceAndVerdictsHorseModel")(
  Db,
  DataTypes
);

db.RaceTypeModel = require("../Models/RaceTypeModel")(Db, DataTypes);
db.RaceKindModel = require("../Models/RaceKindModel")(Db, DataTypes);
db.RaceNameModel = require("../Models/RaceNameModel")(Db, DataTypes);
db.RaceCardModel = require("../Models/RaceCardModel")(Db, DataTypes);
db.VerdictModel = require("../Models/VerdictModel")(Db, DataTypes);
db.SubscriberAndHorsesModel = require("../Models/SubscriberAndHorsesModel")(
  Db,
  DataTypes
);

db.RaceCardRacesModel = require("../Models/RaceCardRacesModel")(Db, DataTypes);

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
db.EquipmentModel = require("../Models/EquipmentModel")(Db, DataTypes);
db.GroundTypeModel = require("../Models/GroundTypeModel")(Db, DataTypes);
db.sequelize.sync({ force: false }).then(() => {
  console.log("yes re-sync done!");
});
db.CompetitionCategoryModel.hasMany(db.CompetitonModel, {
  foreignKey: "CompetitionCategory",
  as: "CompetitionCategoryData",
});
db.CompetitonModel.belongsTo(db.CompetitionCategoryModel, {
  foreignKey: "CompetitionCategory",
  as: "CompetitionCategoryData",
});
db.GroundTypeModel.hasMany(db.RaceModel, {
  foreignKey: "Ground",
  as: "GroundData",
});
db.RaceModel.belongsTo(db.GroundTypeModel, {
  foreignKey: "Ground",
  as: "GroundData",
});

db.RaceCourseModel.hasOne(db.RaceCardModel, {
  foreignKey: "RaceCardCourse",
  as: "RaceCardCourseData",
});
db.RaceCardModel.belongsTo(db.RaceCourseModel, {
  foreignKey: "RaceCardCourse",
  as: "RaceCardCourseData",
});
db.TrackLengthModel.hasMany(db.RaceModel, {
  foreignKey: "TrackLength",
  as: "TrackLengthData",
});
db.RaceModel.belongsTo(db.TrackLengthModel, {
  foreignKey: "TrackLength",
  as: "TrackLengthData",
});
db.RaceCourseModel.hasMany(db.TrackLengthModel, {
  foreignKey: "RaceCourse",
  as: "RaceCourseData",
});
db.TrackLengthModel.belongsTo(db.RaceCourseModel, {
  foreignKey: "RaceCourse",
  as: "RaceCourseData",
});
db.OwnerModel.hasMany(db.OwnerSilkColorModel, {
  foreignKey: "OwnerID",
  as: "OwnerIDData",
});
db.OwnerSilkColorModel.belongsTo(db.OwnerModel, {
  foreignKey: "OwnerID",
  as: "OwnerIDData",
});
db.RaceKindModel.hasMany(db.RaceModel, {
  foreignKey: "RaceKind",
  as: "RaceKindData",
});
db.RaceModel.belongsTo(db.RaceKindModel, {
  foreignKey: "RaceKind",
  as: "RaceKindData",
});
db.HorseKindModel.hasMany(db.HorseModel, {
  foreignKey: "HorseKind",
  as: "HorseKindData",
});
db.HorseModel.belongsTo(db.HorseKindModel, {
  foreignKey: "HorseKind",
  as: "HorseKindData",
});
db.SponsorModel.hasMany(db.RaceModel, {
  foreignKey: "Sponsor",
  as: "SponsorData",
});
db.RaceModel.belongsTo(db.SponsorModel, {
  foreignKey: "Sponsor",
  as: "SponsorData",
});
db.MeetingTypeModel.hasMany(db.RaceModel, {
  foreignKey: "MeetingType",
  as: "MeetingTypeData",
});
db.RaceModel.belongsTo(db.MeetingTypeModel, {
  foreignKey: "MeetingType",
  as: "MeetingTypeData",
});
db.RaceTypeModel.hasMany(db.RaceModel, {
  foreignKey: "RaceType",
  as: "RaceTypeModelData",
});
db.RaceModel.belongsTo(db.RaceTypeModel, {
  foreignKey: "RaceType",
  as: "RaceTypeModelData",
});
db.RaceNameModel.hasMany(db.RaceModel, {
  foreignKey: "RaceName",
  as: "RaceNameModelData",
});
db.RaceModel.belongsTo(db.RaceNameModel, {
  foreignKey: "RaceName",
  as: "RaceNameModelData",
});
db.BreederModel.hasMany(db.HorseModel, {
  foreignKey: "Breeder",
  as: "BreederData",
});
db.HorseModel.belongsTo(db.BreederModel, {
  foreignKey: "Breeder",
  as: "BreederData",
});
db.RaceCardModel.hasMany(db.RaceModel, {
  foreignKey: "RaceCard",
  as: "RaceCardData",
});
db.RaceModel.belongsTo(db.RaceCardModel, {
  foreignKey: "RaceCard",
  as: "RaceCardData",
});
db.SexModel.hasMany(db.HorseModel, {
  foreignKey: "Sex",
  as: "SexModelData",
});
db.HorseModel.belongsTo(db.SexModel, {
  foreignKey: "Sex",
  as: "SexModelData",
});
db.NationalityModel.hasMany(db.HorseModel, {
  foreignKey: "CreationId",
  as: "CreationIdData",
});
db.HorseModel.belongsTo(db.NationalityModel, {
  foreignKey: "CreationId",
  as: "CreationIdData",
});
db.NationalityModel.hasMany(db.HorseModel, {
  foreignKey: "NationalityId",
  as: "NationalityData",
});
db.HorseModel.belongsTo(db.NationalityModel, {
  foreignKey: "NationalityId",
  as: "NationalityData",
});
db.NationalityModel.hasMany(db.OwnerModel, {
  foreignKey: "NationalityID",
  as: "OwnerDataNationalityData",
});
db.OwnerModel.belongsTo(db.NationalityModel, {
  foreignKey: "NationalityID",
  as: "OwnerDataNationalityData",
});
db.NationalityModel.hasMany(db.JockeyModel, {
  foreignKey: "NationalityID",
  as: "JockeyNationalityData",
});
db.JockeyModel.belongsTo(db.NationalityModel, {
  foreignKey: "NationalityID",
  as: "JockeyNationalityData",
});
db.NationalityModel.hasMany(db.RaceCourseModel, {
  foreignKey: "NationalityId",
  as: "NationalityDataRaceCourse",
});
db.RaceCourseModel.belongsTo(db.NationalityModel, {
  foreignKey: "NationalityId",
  as: "NationalityDataRaceCourse",
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
db.RaceCourseModel.belongsTo(db.ColorModel, {
  foreignKey: "ColorCode",
  as: "ColorCodeData",
});
db.ColorModel.hasMany(db.RaceCourseModel, {
  foreignKey: "ColorCode",
  as: "ColorCodeData",
});
db.RaceAndHorseModel.belongsTo(db.EquipmentModel, {
  foreignKey: "Equipment",
  as: "EquipmentData",
});
db.EquipmentModel.hasMany(db.RaceAndHorseModel, {
  foreignKey: "Equipment",
  as: "EquipmentData",
});
db.RaceAndHorseModel.belongsTo(db.VerdictModel, {
  foreignKey: "Verdict",
  as: "VerdictData",
});
db.VerdictModel.hasMany(db.RaceAndHorseModel, {
  foreignKey: "Verdict",
  as: "VerdictData",
});
db.TrackLengthModel.belongsTo(db.GroundTypeModel, {
  foreignKey: "GroundType",
  as: "GroundTypeModelData",
});
db.GroundTypeModel.hasMany(db.TrackLengthModel, {
  foreignKey: "GroundType",
  as: "GroundTypeModelData",
});
db.RaceModel.belongsTo(db.RaceCourseModel, {
  foreignKey: "RaceCourse",
  as: "RaceCourseData",
});
db.RaceModel.belongsToMany(db.JockeyModel, {
  through: "RaceAndJockeyModel",
});
db.JockeyModel.belongsToMany(db.RaceModel, {
  through: "RaceAndJockeyModel",
});
db.RaceModel.belongsToMany(db.HorseModel, {
  through: "RaceAndVerdictsHorseModel",
});
db.HorseModel.belongsToMany(db.RaceModel, {
  through: "RaceAndVerdictsHorseModel",
});
db.SubscriberModel.belongsToMany(db.HorseModel, {
  through: "SubscriberAndHorsesModel",
});
db.HorseModel.belongsToMany(db.SubscriberModel, {
  through: "SubscriberAndHorsesModel",
});
db.RaceModel.belongsToMany(db.HorseModel, {
  through: "RaceAndHorseModel",
});
db.HorseModel.belongsToMany(db.RaceModel, {
  through: "RaceAndHorseModel",
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

db.RaceCardModel.belongsToMany(db.RaceModel, {
  through: "RaceCardRacesModel",
});
db.RaceModel.belongsToMany(db.RaceCardModel, {
  through: "RaceCardRacesModel",
});
db.RaceCardModel.belongsToMany(db.RaceModel, {
  through: "CompetitionRacesPointsModel",
});
db.RaceModel.belongsToMany(db.RaceCardModel, {
  through: "CompetitionRacesPointsModel",
});

db.JockeyModel.belongsToMany(db.HorseModel, {
  through: "HorseJockeyComboModel",
});
db.TrainerModel.belongsToMany(db.HorseModel, {
  through: "HorseTrainerComboModel",
});
db.HorseModel.belongsToMany(db.TrainerModel, {
  through: "HorseTrainerComboModel",
});
db.HorseModel.hasMany(db.ResultModel, {
  foreignKey: "HorseID",
  as: "HorseIDData",
});
db.ResultModel.belongsTo(db.HorseModel, {
  foreignKey: "HorseID",
  as: "HorseIDDataHorse",
});
db.RaceModel.hasMany(db.ResultModel, {
  foreignKey: "RaceID",
  as: "RaceResultData",
});
db.ResultModel.belongsTo(db.RaceModel, {
  foreignKey: "RaceID",
  as: "RaceResultData",
});
db.RaceModel.hasMany(db.RaceAndVerdictsHorseModel, {
  foreignKey: "RaceModelId",
  as: "RaceModelIdData",
});
db.RaceAndVerdictsHorseModel.belongsTo(db.RaceModel, {
  foreignKey: "RaceModelId",
  as: "RaceModelIdData",
});

module.exports = db;
