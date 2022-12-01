const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const RaceCardRacesModel = sequelize.define(
    "RaceCardRacesModel",

    {},
    {
      initialAutoIncrement: 1000,
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return RaceCardRacesModel;
};
