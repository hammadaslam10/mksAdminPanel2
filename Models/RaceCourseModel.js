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
        validate: {
          notNull: { msg: "RaceCourse will have Country" },
          notEmpty: { msg: "Country  will not be empty" },
        },
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
      GroundType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "RaceCourse will have GroundType" },
          notEmpty: { msg: "GroundType  will not be empty" },
        },
      },
      NationalityId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "NationalityModel",
          key: "_id",
        },
      },
      ColorCode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "RaceCourse will have ColorCode" },
          notEmpty: { msg: "ColorCode  will not be empty" },
        },
      },
      shortCode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "RaceCourse will have shortCode" },
          notEmpty: { msg: "shortCode  will not be empty" },
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
// WeatherType: {
//   type: DataTypes.STRING,
//   allowNull: false,
//   validate: {
//     notNull: { msg: "RaceCourse will have WeatherType" },
//     notEmpty: { msg: "WeatherType  will not be empty" },
//   },
// },
// WeatherDegree: {
//   type: DataTypes.STRING,
//   allowNull: false,
//   validate: {
//     notNull: { msg: "RaceCourse will have WeatherDegree" },
//     notEmpty: { msg: "WeatherDegree  will not be empty" },
//   },
// },
// WeatherIcon: {
//   type: DataTypes.STRING,
//   allowNull: false,
//   validate: {
//     notNull: { msg: "RaceCourse will have WeatherIcon" },
//     notEmpty: { msg: "WeatherIcon  will not be empty" },
//   },
// },
