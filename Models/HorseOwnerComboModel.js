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
      initialAutoIncrement: 1000,
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return HorseOwnerCombo;
};
