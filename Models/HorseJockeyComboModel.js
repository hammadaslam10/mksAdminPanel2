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
      freezeTableName: true,
      paranoid: true,
    }
  );
  return HorseJockeyCombo;
};
