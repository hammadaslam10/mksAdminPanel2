const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const SubscriberAndCompetitionModel = sequelize.define(
    "SubscriberAndCompetitionModel",

    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      CompetitionID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      RaceID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      SubscriberID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      HorseID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      Rank: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 10,
    }
  );

  return SubscriberAndCompetitionModel;
};
