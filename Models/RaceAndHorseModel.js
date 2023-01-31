const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const RaceAndHorseModel = sequelize.define(
    "RaceAndHorseModel",
    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      RaceModelId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      HorseModelId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      GateNo: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      HorseNo: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      Equipment: {
        type: DataTypes.UUID,
        allowNull: false
      },
      TrainerOnRace: {
        type: DataTypes.UUID,
        allowNull: false
      },
      JockeyOnRace: {
        type: DataTypes.UUID,
        allowNull: false
      },
      JockeyWeight: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      OwnerOnRace: {
        type: DataTypes.UUID,
        allowNull: false
      },
      CapColor: {
        type: DataTypes.UUID,
        allowNull: false
      },
      JockeyWeight: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      HorseRunningStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1
      },
      Rating: {
        type: DataTypes.BIGINT,
        allowNull: false
      }
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 10,
    }
  );
  return RaceAndHorseModel;
};
