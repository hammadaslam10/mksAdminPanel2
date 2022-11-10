const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const RaceModel = sequelize.define(
    "RaceModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      RaceNameEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Race will have Race Name" },
          notEmpty: { msg: "Race Name  will not be empty" },
        },
      },
      RaceNameAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /[\u0600-\u06FF]/,
          is: {
            msg: "RaceName Must Be In Arabic",
          },
        },
      },
      RaceKind: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Race will have RaceKind" },
          notEmpty: { msg: "RaceKind  will not be empty" },
        },
      },
      TrackLength: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: { msg: "RaceCourse will have TrackLength" },
          notEmpty: { msg: "TrackLength  will not be empty" },
        },
      },
      DescriptionAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /[\u0600-\u06FF]/,
          is: {
            msg: "Race Must Be In Arabic",
          },
        },
      },
      DescriptionEn: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Race will have description" },
          notEmpty: { msg: "Descritpion  will not be empty" },
        },
      },
      RaceStatus: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      DayNTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      RaceCourse: {
        type: DataTypes.UUID,
        references: {
          model: "RaceCourseModel",
          key: "_id",
        },
      },
      RaceType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Race will have RaceKind" },
          notEmpty: { msg: "RaceKind  will not be empty" },
        },
      },
      HorseFilled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      ActiveJockeyForTheRace: {
        type: DataTypes.UUID,
        references: {
          model: "JockeyModel",
          key: "_id",
        },
      },
      WeatherType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "RaceCourse will have WeatherType" },
          notEmpty: { msg: "WeatherType  will not be empty" },
        },
      },
      WeatherDegree: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "RaceCourse will have WeatherDegree" },
          notEmpty: { msg: "WeatherDegree  will not be empty" },
        },
      },
      WeatherIcon: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "RaceCourse will have WeatherIcon" },
          notEmpty: { msg: "WeatherIcon  will not be empty" },
        },
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return RaceModel;
};
