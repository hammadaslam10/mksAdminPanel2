const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const HorseTrainerCombo = sequelize.define(
    "HorseTrainerComboModel",
    {
  
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 1000,
    }
  );
  return HorseTrainerCombo;
};
