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
      Prize: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      Rank: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      Points: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      BonusPoints: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
    },

    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return ResultsModel;
};
