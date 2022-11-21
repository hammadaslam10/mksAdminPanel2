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
          notNull: { msg: "TrackLength Kind will have TrackLength" },
          notEmpty: { msg: "TrackLength  will not be empty" },
        },
      },
      RaceCourse: {
        type: DataTypes.UUID,
        references: {
          model: "RaceCourseModel",
          key: "_id",
        },
      },
      GroundType: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      RaceCourseImage: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "TrackLength Kind will have RaceCourseImage" },
          notEmpty: { msg: "TrackLength  will not be empty" },
        },
      },
      RailPosition: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "TrackLength Kind will have RailPosition" },
          notEmpty: { msg: "TrackLength  will not be empty" },
        },
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return TrackLengthModel;
};
