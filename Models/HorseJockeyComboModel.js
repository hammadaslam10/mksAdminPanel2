const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const HorseJockeyCombo = sequelize.define(
    "HorseJockeyComboModel",
    {
    
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 1000,
    }
  );
  return HorseJockeyCombo;
};
