const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const RaceAndHorseModel = sequelize.define(
    "RaceAndHorseModel",
    {
      GateNo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Equipment: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 10,
    }
  );
  return RaceAndHorseModel;
};
