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
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 1000,
    }
  );
  return SubscriberTrackedHorses;
};
