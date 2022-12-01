const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const HorseJockeyCombo = sequelize.define(
    "HorseJockeyComboModel",
    {
      // HorseModel_id: {
      //   type: Sequelize.UUID,
      // },
      // JockeyModel_id: {
      //   type: Sequelize.UUID,
      // },
    },
    {
      initialAutoIncrement: 1000,
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return HorseJockeyCombo;
};
