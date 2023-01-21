const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const ResultsModel = sequelize.define(
    "ResultsModel",

    {
      RaceID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      HorseID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      BeatenBy: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      FinalPosition: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      PointTableSystem: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      Distance: {
        type: DataTypes.BIGINT,
      },
      CumulativeDistance: {
        type: DataTypes.BIGINT,
      },
      VideoLink: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },

    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 10,
    }
  );
  return ResultsModel;
};
