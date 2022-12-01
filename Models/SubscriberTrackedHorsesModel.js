const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const SubscriberTrackedHorses = sequelize.define(
    "SubscriberTrackedHorsesModel",
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
  return SubscriberTrackedHorses;
};
