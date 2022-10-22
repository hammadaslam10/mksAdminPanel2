const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const HorseTrainerCombo = sequelize.define(
    "HorseTrainerComboModel",
    {
      // HorseModel_id: {
      //   type: Sequelize.UUID,
      // },
      // TrainerModel_id: {
      //   type: Sequelize.UUID,
      // },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return HorseTrainerCombo;
};
