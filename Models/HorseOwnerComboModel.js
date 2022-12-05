const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const HorseOwnerCombo = sequelize.define(
    "HorseOwnerComboModel",
    {
      // HorseModel_id: {
      //   type: Sequelize.UUID,
      // },
      // OwnerModel_id: {
      //   type: Sequelize.UUID,
      // },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 1000,
    }
  );
  return HorseOwnerCombo;
};
