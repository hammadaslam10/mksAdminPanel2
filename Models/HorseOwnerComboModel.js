const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const HorseOwnerCombo = sequelize.define(
    "HorseOwnerComboModel",
    {
   
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 1000,
    }
  );
  return HorseOwnerCombo;
};
