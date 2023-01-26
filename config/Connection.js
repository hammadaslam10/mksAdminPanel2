const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config({ path: "./config/Secrets.env" });
let options = {
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
//     // logging: false
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
db.ColorModel = require("../Models/ColorModel")(Db, DataTypes);
db.BreederModel = require("../Models/BreederModel")(Db, DataTypes);
db.SubscriberModel = require("../Models/SubscriberModel")(Db, DataTypes);
db.AdvertismentModel = require("../Models/AdvertismentModel")(Db, DataTypes);
db.NewsModel = require("../Models/NewsModel")(Db, DataTypes);
db.NewsLetterModel = require("../Models/NewsletterModel")(Db, DataTypes);
db.RaceModel = require("../Models/RaceModel")(Db, DataTypes);
db.ResultModel = require("../Models/ResultsModel")(Db, DataTypes);
db.SliderModel = require("../Models/SliderModel")(Db, DataTypes);
db.SponsorModel = require("../Models/SponsorModel")(Db, DataTypes);
db.RaceAndHorseModel = require("../Models/RaceAndHorseModel")(Db, DataTypes);
db.HorseAndRaceModel = require("../Models/HorseAndRaceModel")(Db, DataTypes);
db.RaceAndJockeyModel = require("../Models/RaceAndJockeyModel")(Db, DataTypes);
db.RaceKindModel = require("../Models/RaceKindModel")(Db, DataTypes);
db.CurrencyModel = require("../Models/CurrencyModel")(Db, DataTypes);
db.CompetitionRacesPointsModel =
  require("../Models/CompetitionRacesPointsModel")(Db, DataTypes);
db.SeokeywordModel = require("../Models/SeoKeywordModel")(Db, DataTypes);
db.CompetitonModel = require("../Models/CompetitonModel")(Db, DataTypes);
db.SexModel = require("../Models/SexModel")(Db, DataTypes);
db.NationalityModel = require("../Models/NationalityModel")(Db, DataTypes);
db.MeetingTypeModel = require("../Models/MeetingTypeModel")(Db, DataTypes);
db.HorseKindModel = require("../Models/HorseKindModel")(Db, DataTypes);
db.OwnerSilkColorModel = require("../Models/OwnerSilkColorModel")(
  Db,
  DataTypes
);
db.OwnerCapModel = require("../Models/OwnerCapModel")(Db, DataTypes);
db.RaceCourseModel = require("../Models/RaceCourseModel")(Db, DataTypes);
db.HorseModel = require("../Models/HorseModel")(Db, DataTypes);
db.OwnerModel = require("../Models/OwnerModel")(Db, DataTypes);
db.JockeyModel = require("../Models/JockeyModel")(Db, DataTypes);
db.TrainerModel = require("../Models/TrainerModel")(Db, DataTypes);
db.TrackLengthModel = require("../Models/TrackLengthModel")(Db, DataTypes);
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
db.SubscriberAndCompetitionModel =
  require("../Models/SubscriberAndCompetitionModel")(Db, DataTypes);
// db.SubscriberAndCompetitionCastModel =
//   require("../Models/SubscriberAndCompetitionCastModel")(Db, DataTypes);
db.RaceTypeModel = require("../Models/RaceTypeModel")(Db, DataTypes);
db.RaceKindModel = require("../Models/RaceKindModel")(Db, DataTypes);
db.RaceNameModel = require("../Models/RaceNameModel")(Db, DataTypes);
db.RaceCardModel = require("../Models/RaceCardModel")(Db, DataTypes);
db.VerdictModel = require("../Models/VerdictModel")(Db, DataTypes);
db.SubscriberAndHorsesModel = require("../Models/SubscriberAndHorsesModel")(
  Db,
  DataTypes
);
db.SubscriberAndOwnerModel = require("../Models/SubscriberAndOwnerModel")(
  Db,
  DataTypes
);
db.SubscriberAndTrainerModel = require("../Models/SubscriberAndTrainerModel")(
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
db.PointTableSystemModel = require("../Models/PointTableSystemModel")(
  Db,
  DataTypes
);
db.FinalPositionModel = require("../Models/FinalPositionModel")(Db, DataTypes);
db.AdminModel = require("../Models/AdminModel")(Db, DataTypes);
db.EquipmentModel = require("../Models/EquipmentModel")(Db, DataTypes);
db.GroundTypeModel = require("../Models/GroundTypeModel")(Db, DataTypes);
db.TrackConditionModel = require("../Models/TrackConditionModel")(
  Db,
  DataTypes
);
db.RaceAndPointsSystemModel = require("../Models/RaceAndPointsSystemModel")(
  Db,
  DataTypes
);
db.RaceResultImagesModel = require("../Models/RaceResultImagesModel")(
  Db,
  DataTypes
);
db.sequelize.sync({ force: false, alter: false }).then(() => {
  console.log("yes re-sync done!");
});
// -------------------------------------SubscriberAndCompetitionModel----------------------------
db.CompetitonModel.hasMany(db.SubscriberAndCompetitionModel, {
  foreignKey: "CompetitionID",
  as: "CompetitionIDData",
});
db.SubscriberAndCompetitionModel.belongsTo(db.CompetitonModel, {
  foreignKey: "CompetitionID",
  as: "CompetitionIDData",
});
db.RaceModel.hasMany(db.SubscriberAndCompetitionModel, {
  foreignKey: "RaceID",
  as: "CompetitionRaceIDData",
});
db.SubscriberAndCompetitionModel.belongsTo(db.RaceModel, {
  foreignKey: "RaceID",
  as: "CompetitionRaceIDData",
});
db.SubscriberModel.hasMany(db.SubscriberAndCompetitionModel, {
  foreignKey: "SubscriberID",
  as: "CompetitionSubscriberIDData",
});
db.SubscriberAndCompetitionModel.belongsTo(db.SubscriberModel, {
  foreignKey: "SubscriberID",
  as: "CompetitionSubscriberIDData",
});
db.HorseModel.hasMany(db.SubscriberAndCompetitionModel, {
  foreignKey: "HorseID",
  as: "CompetitionHorseIDData",
});
db.SubscriberAndCompetitionModel.belongsTo(db.HorseModel, {
  foreignKey: "HorseID",
  as: "CompetitionHorseIDData",
});
// -------------------------------------RaceAndPointsSystemModel----------------------------
db.RaceModel.hasMany(db.RaceAndPointsSystemModel, {
  foreignKey: "Race",
  as: "RaceData",
});
db.RaceAndPointsSystemModel.belongsTo(db.RaceModel, {
  foreignKey: "Race",
  as: "RaceData",
});
db.RaceModel.hasMany(db.RaceResultImagesModel, {
  foreignKey: "Race",
  as: "RaceimagesData",
});
db.RaceResultImagesModel.belongsTo(db.RaceModel, {
  foreignKey: "Race",
  as: "RaceimagesData",
});
db.RaceAndPointsSystemModel.belongsTo(db.PointTableSystemModel, {
  foreignKey: "Point",
  as: "PointsListingData",
});
db.PointTableSystemModel.hasMany(db.RaceAndPointsSystemModel, {
  foreignKey: "Point",
  as: "PointsListingData",
});
// -------------------------------------Competition----------------------------
db.CompetitionCategoryModel.hasMany(db.CompetitonModel, {
  foreignKey: "CompetitionType",
  as: "CompetitionTypeData",
});
db.CompetitonModel.belongsTo(db.CompetitionCategoryModel, {
  foreignKey: "CompetitionType",
  as: "CompetitionTypeData",
});
db.SponsorModel.hasMany(db.CompetitonModel, {
  foreignKey: "CompetitionSponsor",
  as: "CompetitionSponsorData",
});
db.CompetitonModel.belongsTo(db.SponsorModel, {
  foreignKey: "CompetitionSponsor",
  as: "CompetitionSponsorData",
});
db.CompetitonModel.belongsToMany(db.RaceModel, {
  through: "CompetitionRacesPointsModel",
  as: "CompetitionRacesPointsModelData",
});
db.RaceModel.belongsToMany(db.CompetitonModel, {
  through: "CompetitionRacesPointsModel",
  as: "CompetitionRacesPointsModelData",
});

// -------------------------------------HorseandJockey----------------------------
db.JockeyModel.belongsToMany(db.HorseModel, {
  through: "HorseJockeyComboModel",
});
db.HorseModel.belongsToMany(db.JockeyModel, {
  through: "HorseJockeyComboModel",
});
db.RaceModel.belongsToMany(db.JockeyModel, {
  through: "RaceAndJockeyModel",
});
// -------------------------------------RaceandJockey----------------------------
db.JockeyModel.belongsToMany(db.RaceModel, {
  through: "RaceAndJockeyModel",
});
db.JockeyModel.belongsToMany(db.RaceModel, {
  through: "RaceAndJockeyModel",
});
// -------------------------------------Trainer----------------------------
db.TrainerModel.belongsToMany(db.HorseModel, {
  through: "HorseTrainerComboModel",
});
db.HorseModel.belongsToMany(db.TrainerModel, {
  through: "HorseTrainerComboModel",
});
db.NationalityModel.hasMany(db.TrainerModel, {
  foreignKey: "NationalityID",
  as: "TrainerNationalityData",
});
db.TrainerModel.belongsTo(db.NationalityModel, {
  foreignKey: "NationalityID",
  as: "TrainerNationalityData",
});
db.NationalityModel.hasMany(db.SubscriberModel, {
  foreignKey: "NationalityID",
  as: "SubscriberNationalityData",
});
db.SubscriberModel.belongsTo(db.NationalityModel, {
  foreignKey: "NationalityID",
  as: "SubscriberNationalityData",
});

// -------------------------------------Owner----------------------------
db.NationalityModel.hasMany(db.OwnerModel, {
  foreignKey: "NationalityID",
  as: "OwnerDataNationalityData",
});
db.OwnerModel.belongsTo(db.NationalityModel, {
  foreignKey: "NationalityID",
  as: "OwnerDataNationalityData",
});
db.OwnerModel.hasMany(db.OwnerSilkColorModel, {
  foreignKey: "OwnerID",
  as: "OwnerIDData",
});
db.OwnerSilkColorModel.belongsTo(db.OwnerModel, {
  foreignKey: "OwnerID",
  as: "OwnerIDData",
});
db.OwnerModel.hasMany(db.OwnerCapModel, {
  foreignKey: "OwnerID",
  as: "OwnerIDcapData",
});
db.OwnerCapModel.belongsTo(db.OwnerModel, {
  foreignKey: "OwnerID",
  as: "OwnerIDcapData",
});
// -------------------------------------Horse----------------------------
db.HorseKindModel.hasMany(db.HorseModel, {
  foreignKey: "KindHorse",
  as: "KindHorseData",
});
db.HorseModel.belongsTo(db.HorseKindModel, {
  foreignKey: "KindHorse",
  as: "KindHorseData",
});
db.BreederModel.hasMany(db.HorseModel, {
  foreignKey: "Breeder",
  as: "BreederData",
});
db.HorseModel.belongsTo(db.BreederModel, {
  foreignKey: "Breeder",
  as: "BreederData",
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
  foreignKey: "NationalityID",
  as: "NationalityData",
});
db.HorseModel.belongsTo(db.NationalityModel, {
  foreignKey: "NationalityID",
  as: "NationalityData",
});
db.HorseModel.belongsTo(db.ColorModel, {
  foreignKey: "ColorID",
  as: "ColorIDData",
});
db.ColorModel.hasMany(db.HorseModel, {
  foreignKey: "ColorID",
  as: "ColorIDData",
});
db.TrainerModel.hasOne(db.HorseModel, {
  foreignKey: "ActiveTrainer",
  as: "ActiveTrainerData",
});
db.HorseModel.belongsTo(db.TrainerModel, {
  foreignKey: "ActiveTrainer",
  as: "ActiveTrainerData",
});
db.OwnerModel.hasOne(db.HorseModel, {
  foreignKey: "ActiveOwner",
  as: "ActiveOwnerData",
});
db.HorseModel.belongsTo(db.OwnerModel, {
  foreignKey: "ActiveOwner",
  as: "ActiveOwnerData",
});
db.HorseModel.belongsTo(db.HorseModel, {
  foreignKey: "Dam",
  as: "DamData",
});
db.HorseModel.belongsTo(db.HorseModel, {
  foreignKey: "Sire",
  as: "SireData",
});
db.HorseModel.belongsTo(db.HorseModel, {
  foreignKey: "GSire",
  as: "GSireData",
});
// -------------------------------------Tracklength----------------------------
db.TrackLengthModel.belongsTo(db.GroundTypeModel, {
  foreignKey: "GroundType",
  as: "GroundTypeModelData",
});
db.GroundTypeModel.hasMany(db.TrackLengthModel, {
  foreignKey: "GroundType",
  as: "GroundTypeModelData",
});
db.RaceCourseModel.hasMany(db.TrackLengthModel, {
  foreignKey: "RaceCourse",
  as: "TrackLengthRaceCourseData",
});
db.TrackLengthModel.belongsTo(db.RaceCourseModel, {
  foreignKey: "RaceCourse",
  as: "TrackLengthRaceCourseData",
});
// -------------------------------------RaceCourse----------------------------
db.NationalityModel.hasMany(db.RaceCourseModel, {
  foreignKey: "NationalityID",
  as: "NationalityDataRaceCourse",
});
db.RaceCourseModel.belongsTo(db.NationalityModel, {
  foreignKey: "NationalityID",
  as: "NationalityDataRaceCourse",
});

db.RaceCourseModel.belongsTo(db.ColorModel, {
  foreignKey: "ColorCode",
  as: "ColorCodeData",
});
db.ColorModel.hasMany(db.RaceCourseModel, {
  foreignKey: "ColorCode",
  as: "ColorCodeData",
});
db.RaceCourseModel.hasMany(db.RaceModel, {
  foreignKey: "RaceCourse",
  as: "RaceCourseData",
});
db.RaceModel.belongsTo(db.RaceCourseModel, {
  foreignKey: "RaceCourse",
  as: "RaceCourseData",
});
// -------------------------------------Race----------------------------
db.GroundTypeModel.hasMany(db.RaceModel, {
  foreignKey: "Ground",
  as: "GroundData",
});
db.RaceModel.belongsTo(db.GroundTypeModel, {
  foreignKey: "Ground",
  as: "GroundData",
});
db.TrackConditionModel.hasMany(db.RaceModel, {
  foreignKey: "TrackCondition",
  as: "TrackConditionData",
});
db.RaceModel.belongsTo(db.TrackConditionModel, {
  foreignKey: "TrackCondition",
  as: "TrackConditionData",
});
db.RaceKindModel.hasMany(db.RaceModel, {
  foreignKey: "RaceKind",
  as: "RaceKindData",
});
db.RaceModel.belongsTo(db.RaceKindModel, {
  foreignKey: "RaceKind",
  as: "RaceKindData",
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
db.TrackLengthModel.hasMany(db.RaceModel, {
  foreignKey: "TrackLength",
  as: "TrackLengthData",
});
db.RaceModel.belongsTo(db.TrackLengthModel, {
  foreignKey: "TrackLength",
  as: "TrackLengthData",
});
// db.PointTableSystemModel.hasMany(db.RaceModel, {
//   foreignKey: "PointTableSystem",
//   as: "PointTableSystemData",
// });
// db.RaceModel.belongsTo(db.PointTableSystemModel, {
//   foreignKey: "PointTableSystem",
//   as: "PointTableSystemData",
// });
// -------------------------------------RaceandHorseResult----------------------------
db.HorseModel.hasMany(db.ResultModel, {
  foreignKey: "HorseID",
  as: "HorseIDData",
});
db.ResultModel.belongsTo(db.HorseModel, {
  foreignKey: "HorseID",
  as: "HorseIDData",
});
db.HorseModel.hasMany(db.ResultModel, {
  foreignKey: "BeatenBy",
  as: "BeatenByData",
});
db.ResultModel.belongsTo(db.HorseModel, {
  foreignKey: "BeatenBy",
  as: "BeatenByData",
});
db.PointTableSystemModel.hasMany(db.ResultModel, {
  foreignKey: "PointTableSystem",
  as: "PointTableSystemData",
});
db.ResultModel.belongsTo(db.PointTableSystemModel, {
  foreignKey: "PointTableSystem",
  as: "PointTableSystemData",
});
db.FinalPositionModel.hasMany(db.ResultModel, {
  foreignKey: "FinalPosition",
  as: "FinalPositionDataHorse",
});
db.ResultModel.belongsTo(db.FinalPositionModel, {
  foreignKey: "FinalPosition",
  as: "FinalPositionDataHorse",
});
db.RaceModel.hasMany(db.ResultModel, {
  foreignKey: "RaceID",
  as: "RaceResultData",
});
db.ResultModel.belongsTo(db.RaceModel, {
  foreignKey: "RaceID",
  as: "RaceResultData",
});
db.RaceModel.hasMany(db.HorseAndRaceModel, {
  foreignKey: "RaceModelId",
  as: "RacehorsesData",
});
db.HorseAndRaceModel.belongsTo(db.RaceModel, {
  foreignKey: "RaceModelId",
  as: "RacehorsesData",
});
db.HorseModel.hasMany(db.HorseAndRaceModel, {
  foreignKey: "HorseModelId",
  as: "HorseModelIdData1",
});
db.HorseAndRaceModel.belongsTo(db.HorseModel, {
  foreignKey: "HorseModelId",
  as: "HorseModelIdData1",
});
db.EquipmentModel.hasMany(db.HorseAndRaceModel, {
  foreignKey: "Equipment",
  as: "EquipmentData1",
});
db.HorseAndRaceModel.belongsTo(db.EquipmentModel, {
  foreignKey: "Equipment",
  as: "EquipmentData1",
});
db.OwnerModel.hasMany(db.HorseAndRaceModel, {
  foreignKey: "OwnerOnRace",
  as: "OwnerOnRaceData1",
});
db.HorseAndRaceModel.belongsTo(db.OwnerModel, {
  foreignKey: "OwnerOnRace",
  as: "OwnerOnRaceData1",
});
db.TrainerModel.hasMany(db.HorseAndRaceModel, {
  foreignKey: "TrainerOnRace",
  as: "TrainerOnRaceData1",
});
db.HorseAndRaceModel.belongsTo(db.TrainerModel, {
  foreignKey: "TrainerOnRace",
  as: "TrainerOnRaceData1",
});
db.JockeyModel.hasMany(db.HorseAndRaceModel, {
  foreignKey: "JockeyOnRace",
  as: "JockeyOnRaceData1",
});
db.HorseAndRaceModel.belongsTo(db.JockeyModel, {
  foreignKey: "JockeyOnRace",
  as: "JockeyOnRaceData1",
});
// -------------------------------------Raceandy----------------------------
// db.RaceModel.belongsToMany(db.JockeyModel, {
//   through: "RaceAndJockeyModel",
// });
// db.JockeyModel.belongsToMany(db.RaceModel, {
//   through: "RaceAndJockeyModel",
// });
// -------------------------------------RaceandOwner----------------------------
db.OwnerModel.belongsToMany(db.HorseModel, {
  through: "HorseOwnerComboModel",
});

// db.HorseModel.belongsToMany(db.JockeyModel, {
//   through: "HorseJockeyComboModel",
// });
// -------------------------------------RaceandHorse----------------------------
db.HorseModel.belongsToMany(db.RaceModel, {
  through: "RaceAndHorseModel",
});

// -------------------------------------SubscriberAndRace----------------------------
db.SubscriberModel.belongsToMany(db.HorseModel, {
  through: "SubscriberAndHorsesModel",
  as: "TrackHorses",
});
db.HorseModel.belongsToMany(db.SubscriberModel, {
  through: "SubscriberAndHorsesModel",
  as: "TrackHorses",
});
db.SubscriberModel.belongsToMany(db.TrainerModel, {
  through: "SubscriberAndTrainerModel",
  as: "TrackTrainers",
});
db.TrainerModel.belongsToMany(db.SubscriberModel, {
  through: "SubscriberAndTrainerModel",
  as: "TrackTrainers",
});
db.SubscriberModel.belongsToMany(db.OwnerModel, {
  through: "SubscriberAndOwnerModel",
  as: "TrackOwners",
});
db.OwnerModel.belongsToMany(db.SubscriberModel, {
  through: "SubscriberAndOwnerModel",
  as: "TrackOwners",
});
// -------------------------------------VerdictAndRace----------------------------
db.RaceModel.belongsToMany(db.HorseModel, {
  through: "RaceAndVerdictsHorseModel",
});
db.HorseModel.belongsToMany(db.RaceModel, {
  through: "RaceAndVerdictsHorseModel",
});
db.RaceAndHorseModel.belongsTo(db.VerdictModel, {
  foreignKey: "Verdict",
  as: "VerdictData",
});
db.VerdictModel.hasMany(db.RaceAndHorseModel, {
  foreignKey: "Verdict",
  as: "VerdictData",
});
// -------------------------------------RaceCard----------------------------
db.RaceCourseModel.hasOne(db.RaceCardModel, {
  foreignKey: "RaceCardCourse",
  as: "RaceCardCourseData",
});
db.RaceCardModel.belongsTo(db.RaceCourseModel, {
  foreignKey: "RaceCardCourse",
  as: "RaceCardCourseData",
});
// db.RaceCardModel.hasMany(db.RaceModel, {
//   foreignKey: "RaceCard",
//   as: "RaceCardData",
// });
// db.RaceModel.belongsTo(db.RaceCardModel, {
//   foreignKey: "RaceCard",
//   as: "RaceCardData",
// });
db.RaceCardModel.belongsToMany(db.RaceModel, {
  through: "RaceCardRacesModel",
  as: "RaceCardRacesModelData",
});
db.RaceModel.belongsToMany(db.RaceCardModel, {
  through: "RaceCardRacesModel",
  as: "RaceCardRacesModelData",
});
// -------------------------------------RaceandHorse----------------------------
db.RaceAndHorseModel.belongsTo(db.EquipmentModel, {
  foreignKey: "Equipment",
  as: "EquipmentData",
});
db.EquipmentModel.hasMany(db.RaceAndHorseModel, {
  foreignKey: "Equipment",
  as: "EquipmentData",
});
db.RaceAndHorseModel.belongsTo(db.JockeyModel, {
  foreignKey: "JockeyOnRace",
  as: "JockeyOnRaceData",
});
db.JockeyModel.hasMany(db.RaceAndHorseModel, {
  foreignKey: "JockeyOnRace",
  as: "JockeyOnRaceData",
});
db.RaceAndHorseModel.belongsTo(db.TrainerModel, {
  foreignKey: "TrainerOnRace",
  as: "TrainerOnRaceData",
});
db.TrainerModel.hasMany(db.RaceAndHorseModel, {
  foreignKey: "TrainerOnRace",
  as: "TrainerOnRaceData",
});
db.RaceModel.belongsToMany(db.HorseModel, {
  through: "RaceAndHorseModel",
  as: "RaceAndHorseModelData",
});
db.HorseModel.belongsToMany(db.RaceModel, {
  through: "RaceAndHorseModel",
  as: "RaceAndHorseModelData",
});
// db.HorseModel.hasMany(db.RaceAndHorseModel, {
//   through: "RaceAndHorseModel",
//   as: "RaceAndHorseModelData",
// });
// db.RaceAndHorseModel.belongsTo(db.HorseModel, {
//   through: "RaceAndHorseModel",
//   as: "RaceAndHorseModelData",
// });
// -------------------------------------Jockey----------------------------
db.NationalityModel.hasMany(db.JockeyModel, {
  foreignKey: "NationalityID",
  as: "JockeyNationalityData",
});
db.JockeyModel.belongsTo(db.NationalityModel, {
  foreignKey: "NationalityID",
  as: "JockeyNationalityData",
});
module.exports = db;
// with recursive cte (Dam,Sire, shortCode, _id) as (
//   select     Dam,  Sire,
//              shortCode,
//              _id
//   from       mksracing.HorseModel
//   where      _id = '7847c435-6af0-411b-ab7a-3ee008cdf1aa'
//   union all
//   select     p.Dam,
//              p.Sire,
//              p.shortCode,
//              p._id
//   from       HorseModel p
//   inner join cte
//           on p._id = cte.Dam
// )
// select * from cte;
// with recursive cte (Dam,Sire, shortCode, _id) as (
//   select     Dam,  Sire,
//              shortCode,
//              _id
//   from       mksracing.HorseModel
//   where      _id = '7847c435-6af0-411b-ab7a-3ee008cdf1aa'
//   union all
//   select     p.Dam,
//              p.Sire,
//              p.shortCode,
//              p._id
//   from       HorseModel p
//   inner join cte
//           on p._id = cte.Sire
// )
// select * from cte;
