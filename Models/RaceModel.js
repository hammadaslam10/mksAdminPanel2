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
      MeetingType: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      MeetingCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      RaceName: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Race will have Race Name" },
          notEmpty: { msg: "Race Name  will not be empty" },
        },
      },

      RaceKind: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Race will have RaceKind" },
          notEmpty: { msg: "RaceKind  will not be empty" },
        },
      },
      TrackLength: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      Ground: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      DescriptionAr: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[\u0621-\u064A\u0660-\u0669]*$/gm,
          is: {
            msg: "Race Description Must Be In Arabic",
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
        defaultValue: 0,
      },
      DayNTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      RaceCourse: {
        type: DataTypes.UUID,
      },
      RaceType: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Race will have RaceType" },
          notEmpty: { msg: "RaceType  will not be empty" },
        },
      },
      HorseFilled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      WeatherType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Race will have WeatherType" },
          notEmpty: { msg: "WeatherType  will not be empty" },
        },
      },
      WeatherDegree: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Race will have WeatherDegree" },
          notEmpty: { msg: "WeatherDegree  will not be empty" },
        },
      },
      WeatherIcon: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Race will have WeatherIcon" },
          notEmpty: { msg: "WeatherIcon  will not be empty" },
        },
      },
      RaceType: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Race will have RaceType" },
          notEmpty: { msg: "RaceType  will not be empty" },
        },
      },
      FirstPrice: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      SecondPrice: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      ThirdPrice: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      FourthPrice: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      FifthPrice: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      SixthPrice: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      RaceCard: {
        type: DataTypes.UUID,
      },
      Competition: {
        type: DataTypes.UUID,
      },
      Sponsor: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "Race will have Sponsor" },
          notEmpty: { msg: "Sponsor  will not be empty" },
        },
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 1000,
    }
  );
  return RaceModel;
};
