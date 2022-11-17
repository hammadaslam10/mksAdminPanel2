const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const RaceAndHorseModel = sequelize.define(
    "RaceAndHorseModel",
    {
      GateNo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return RaceAndHorseModel;
};
