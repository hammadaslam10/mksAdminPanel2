const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const CompetitonWinnersModel = sequelize.define(
    "CompetitonWinnersModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      CompetitionRacePointID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      WinnerUserId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      initialAutoIncrement: 1000,
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
  return CompetitonWinnersModel;
};
