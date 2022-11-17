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
      // JockeyCap:{
      //   type: DataTypes.STRING,
      //   allowNull: false,
      // }
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return RaceAndJockeyModel;
};
