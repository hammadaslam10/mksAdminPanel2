const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const HorseAndRaceModel = sequelize.define(
    "HorseAndRaceModel",
    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      RaceModelId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      HorseModelId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      GateNo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Equipment: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      TrainerOnRace: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      JockeyOnRace: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      OwnerOnRace: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      JockeyWeight: {
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
  return HorseAndRaceModel;
};
