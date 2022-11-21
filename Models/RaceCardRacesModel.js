const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const RaceCardRacesModel = sequelize.define(
    "RaceCardRacesModel",

    {
      RaceID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return RaceCardRacesModel;
};
