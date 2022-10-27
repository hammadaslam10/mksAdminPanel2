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
      },
      TrackLength: {
        type: DataTypes.INTEGER,
      },
      WeatherType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      WeatherDegree: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      WeatherIcon: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return RaceCourseModel;
};
