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
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 10,
    }
  );
  return RaceAndJockeyModel;
};
