const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const RaceCardRacesModel = sequelize.define(
    "RaceCardRacesModel",

    {},
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return RaceCardRacesModel;
};
