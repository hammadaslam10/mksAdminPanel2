const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const RaceAndHorseModel = sequelize.define(
    "RaceAndHorseModel",
    {
      GateNo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Equipment: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      JockeyModelId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      TrainerOnRace: {
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
  return RaceAndHorseModel;
};
