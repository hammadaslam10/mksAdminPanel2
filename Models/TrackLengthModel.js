const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const TrackLengthModel = sequelize.define(
    "TrackLengthModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      TrackLength: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: { msg: "TrackLength  will have TrackLength Total Lenght" },
          notEmpty: { msg: "TrackLength  Total Lenght will not be empty" },
        },
      },
      RaceCourse: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "TrackLength  will have RaceCourse" },
          notEmpty: { msg: "RaceCourse  will not be empty" },
        },
      },
      GroundType: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: { msg: "TrackLength  will have GroundType" },
          notEmpty: { msg: "GroundType  will not be empty" },
        },
      },
      RaceCourseImage: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "TrackLength  will have RaceCourseImage" },
          notEmpty: { msg: "RaceCourseImage  will not be empty" },
        },
      },
      RailPosition: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "TrackLength  will have RailPosition" },
          notEmpty: { msg: "RailPosition  will not be empty" },
        },
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 10,
    }
  );
  return TrackLengthModel;
};
