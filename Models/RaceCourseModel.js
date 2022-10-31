const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const RaceCourseModel = sequelize.define(
    "RaceCourseModel",

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
      Country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      TrackName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "RaceCourse will have TrackName" },
          notEmpty: { msg: "TrackName  will not be empty" },
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
  return RaceCourseModel;
};
