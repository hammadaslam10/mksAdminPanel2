const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const HorseOwnerCombo = sequelize.define(
    "HorseOwnerComboModel",
    {
   
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 10,
    }
  );
  return HorseOwnerCombo;
};
