const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config({ path: "./config/Secrets.env" });
var options = {
  host: "database-2.cgk4a7qwslgi.us-west-1.rds.amazonaws.com",
  port: 3306,
  logging: console.log,
  maxConcurrentQueries: 100,
  dialect: "mysql",
  ssl: "Amazon RDS",
  pool: { maxDbions: 5, maxIdleTime: 30 },
  language: "en",
  Protocol: "TCP",
};
const Db = new Sequelize("mksracingdevtest", "admin", "abc.12345", {
  ...options,
});

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

// db.RaceAndHorseModel.sync({ alter: true });
// db.RaceCourseModel.sync({ alter: true });
// db.RaceModel.belongsTo(db.JockeyModel, {
//   foreignKey: "ActiveJockeyForTheRace",
//   as: "ActiveJockeyForTheRaceData",
// });
// db.RaceKindModel.hasMany(db.RaceModel, {
//   foreignKey: "RaceKind",
//   as: "RaceKindData",
// });
// db.RaceModel.belongsTo(db.RaceKindModel, {
//   foreignKey: "RaceKind",
//   as: "RaceKindData",
// });
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
// db.SubscriberModel.hasMany(db.RaceModel, {
//   foreignKey: "TrackLength",
//   as: "TrackLengthData",
// });
// db.RaceModel.belongsTo(db.SubscriberModel, {
//   foreignKey: "TrackLength",
//   as: "TrackLengthData",
// });
// db.HorseModel.hasMany(db.RaceAndVerdictsHorseModel, {
//   foreignKey: "HorseModelId",
//   as: "HorseModelIdData",
// });
// db.RaceAndVerdictsHorseModel.hasMany(db.HorseModel, {
//   foreignKey: "HorseModelId",
//   as: "HorseModelIdData",
// });
// db.JockeyModel.hasMany(db.RaceAndJockeyModel, {
//   foreignKey: "JockeyModelId",
//   as: "JockeyModelIdData",
// });
// db.RaceAndJockeyModel.belongsTo(db.JockeyModel, {
//   foreignKey: "JockeyModelId",
//   as: "JockeyModelIdData",
// });
// db.RaceModel.hasMany(db.RaceAndJockeyModel, {
//   foreignKey: "RaceModelId2",
//   as: "RaceModelId2Data",
// });
// db.RaceAndJockeyModel.belongsTo(db.RaceModel, {
//   foreignKey: "RaceModelId2",
//   as: "RaceModelId2Data",
// });
// db.RaceModel.hasMany(db.RaceAndHorseModel, {
//   foreignKey: "RaceModelId",
//   as: "RaceModelIdData",
// });
// db.RaceAndHorseModel.belongsTo(db.RaceModel, {
//   foreignKey: "RaceModelId",
//   as: "RaceModelIdData",
// });
// db.RaceCardRacesModel.hasMany(db.RaceModel, {
//   foreignKey: "RaceCard",
//   as: "RaceCardData",
// });
// db.RaceModel.belongsTo(db.RaceCardRacesModel, {
//   foreignKey: "RaceCard",
//   as: "RaceCardData",
// });

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
// db.HorseModel.belongsTo(db.RaceTypeModel, {
//   foreignKey: "RaceName",
//   as: "RaceNameData",
// });
// db.BreederModel.hasMany(db.HorseModel, {
//   foreignKey: "RaceName",
//   as: "RaceNameData",
// });
// db.RaceModel.hasMany(db.RaceModel, {
//   foreignKey: "HorseID",
//   as: "HorseIDModelData",
// });
// db.RaceModel.belongsTo(db.RaceModel, {
//   foreignKey: "HorseID",
//   as: "HorseIDModelData",
// });
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
// db.SubscriberModel.belongsToMany(db.EmailTemplateModel, {
//   through: "EmailAndSubscriberModel",
// });
// db.EmailTemplateModel.belongsToMany(db.SubscriberModel, {
//   through: "EmailAndSubscriberModel",
// });
// db.RaceModel.belongsToMany(db.JockeyModel, {
//   through: "RaceAndVerdictsJockeyModel",
// });
// db.JockeyModel.belongsToMany(db.RaceModel, {
//   through: "RaceAndVerdictsJockeyModel",
// });
// db.JockeyModel.belongsToMany(db.RaceAndVerdictsJockeyModel, {
//   through: "RaceAndVerdictsJockeyModel",
// });
// db.RaceAndVerdictsJockeyModel.belongsToMany(db.JockeyModel, {
//   through: "RaceAndVerdictsJockeyModel",
// });
db.RaceModel.belongsToMany(db.HorseModel, {
  through: "RaceAndHorseModel",
});
db.HorseModel.belongsToMany(db.RaceModel, {
  through: "RaceAndHorseModel",
});
// db.RaceModel.belongsToMany(db.HorseModel, {
//   through: "RaceAndVerdictsHorseModel",
// });
// db.HorseModel.belongsToMany(db.RaceModel, {
//   through: "RaceAndVerdictsHorseModel",
// });
db.HorseModel.belongsToMany(db.OwnerModel, {
  through: "HorseOwnerComboModel",
});
db.OwnerModel.belongsToMany(db.HorseModel, {
  through: "HorseOwnerComboModel",
});
db.HorseModel.belongsToMany(db.JockeyModel, {
  through: "HorseJockeyComboModel",
});
// db.RaceModel.belongsToMany(db.HorseModel, {
//   through: "RaceAndVerdictsHorseModel",
// });
// db.HorseModel.belongsToMany(db.RaceModel, {
//   through: "RaceAndVerdictsHorseModel",
// });
// db.RaceModel.belongsToMany(db.JockeyModel, {
//   through: "RaceAndVerdictsJockeyModel",
// });
db.RaceCardModel.belongsToMany(db.RaceModel, {
  through: "RaceCardRacesModel",
});
db.RaceModel.belongsToMany(db.RaceCardModel, {
  through: "RaceCardRacesModel",
});
// db.JockeyModel.belongsToMany(db.RaceModel, {
//   through: "RaceAndVerdictsJockeyModel",
// });
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
// db.RaceModel.hasMany(db.RaceAndVerdictsHorseModel, {
//   foreignKey: "HorseModelId",
//   as: "HorseModelIdData",
// });
// db.RaceAndVerdictsHorseModel.belongsTo(db.RaceModel, {
//   foreignKey: "HorseModelId",
//   as: "HorseModelIdData",
// });

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
