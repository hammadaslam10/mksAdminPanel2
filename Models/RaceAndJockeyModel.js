const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const RaceAndJockeyModel = sequelize.define(
    "RaceAndJockeyModel",
    {
      GateNo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      JockeyWeight: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      initialAutoIncrement: 1000,
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return RaceAndJockeyModel;
};
